const express = require('express');
const router = express.Router();
const Message = require(`libs/message`);

const validator = require(`libs/validator`);

const db = require(`libs/db`);

const service_auth_kakao = require(`service/auth/kakao`);
const service_member = require(`service/member/member`);

const ban_str_list = 'admin, 관리자, test, 테스트';

router.get('/', async (req, res, next) => {
    let { code } = req.query;
    let rd_uri = req.headers.scheme + '://' + req.headers.host;

    let access_data = await service_auth_kakao.get_token(code, rd_uri);

    res.redirect('/auth/kakao?token=' + access_data.access_token);
});

router.get('/get_member_data', async (req, res, next) => {
    let { token, keep_check } = req.query;

    req.connector = await db.get_connection();

    let member_data = await service_auth_kakao.get_member_data(token, keep_check, req);

    delete member_data.auth_id;

    if(member_data['x-token'] !== undefined) {
        member_data['x-token'] = await member_data['x-token'];
    }

    member_data['token'] = token;

    await db.commit(req.connector);

    res.json(member_data);
});

router.post('/sign_up', async (req, res, next) => {
    let { nickname, email, auth_data } = req.body;
    await validator.str('nickname, email', req.body);

    if(auth_data === undefined || auth_data.token === undefined){
        throw Message.WRONG_PARAM('auth_data');
    }

    await validator.ban_str(nickname, ban_str_list);
    await validator.ban_str(email, ban_str_list);

    await service_member.email_dup_check(email);

    let member_data = await service_auth_kakao.get_member_data(auth_data.token);

    if(member_data['x-token'] !== undefined){
        res.json({'x-token' : member_data['x-token']});
        return;
    }

    req.body.auth_data = { ...auth_data, ...member_data };

    req.connector = await db.get_connection();

    await service_auth_kakao.sign_up(req);

    await db.commit(req.connector);

    res.json({'x-token' : await service_auth_kakao.select_to_auth_id(auth_data.auth_id)});
});

router.post('/member_link', async (req, res, next) => {
    let { token } = req.body;

    await validator.str('id, password, token', req.body);

    let member_data = await service_auth_kakao.get_member_data(token);

    if(member_data['x-token'] !== undefined){
        res.json(member_data);
        return;
    }

    req.connector = await db.get_connection();

    let member_info = await service_auth_kakao.member_link(req, member_data.auth_id);

    await db.commit(req.connector);

    res.json({'x-token' : member_info['x-token']});
});


module.exports = router;
