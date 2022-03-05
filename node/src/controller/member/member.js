const express = require('express');
const router = express.Router();
const Message = require(`libs/message`);

const validator = require(`libs/validator`);
const member = require(`libs/member`);

const db = require(`libs/db`);
const utils = require(`libs/utils`);

const multer = require('multer');
const memorystorage = multer.memoryStorage();
const upload = multer({ storage: memorystorage });

const service_member = require(`service/member/member`);

const ban_str_list = 'admin, 어드민, 관리자, test, 테스트';

router.use('/sale', require('./sale/sale'));

router.get('/', member.login_check(), async (req, res, next) => {
    res.json(req.member);
});

router.post('/login', async (req, res, next) => {
    let { id, password, keep_check } = req.body;
    let member_info;

    await validator.str('id, password', req.body);

    req.connector = await db.get_connection();

    member_info = await service_member.login(id, password, keep_check, req);

    await db.commit(req.connector);

    res.json({'x-token' : member_info['x-token']});
});

router.post('/sign_up', async (req, res, next) => {
    let { id, nickname, email } = req.body;
    await validator.str('id, nickname, password, email', req.body);

    await validator.ban_str(id, ban_str_list);
    await validator.ban_str(nickname, ban_str_list);
    await validator.ban_str(email, ban_str_list);

    await service_member.id_dup_check(req, id);
    await service_member.nick_dup_check(req, nickname);
    await service_member.email_dup_check(req, email);

    req.connector = await db.get_connection();

    await service_member.sign_up(req);

    await db.commit(req.connector);

    res.json(true);
});

router.patch('/', member.login_check(), async (req, res, next) => {
    let require_keys = 'email, nickname';

    await validator.str(require_keys, req.body);

    let { nickname, email, old_password } = req.body;

    if(req.member.auth_id === null) {
        if (old_password === undefined || old_password.toString().replace(/\s/g, '') === '') {
            throw Message.INVALID_PARAM('이전 비밀번호');
        }

        await service_member.old_pwd_check(req.member.idx, old_password);
    }

    await validator.ban_str(nickname, ban_str_list);
    await validator.ban_str(email, ban_str_list);

    await service_member.nick_dup_check(req, nickname);
    await service_member.email_dup_check(req, email);

    req.connector = await db.get_connection();

    await service_member.update_member(req);

    await db.commit(req.connector);

    res.json(true);
});

router.patch('/img', member.login_check(), upload.any(), async (req, res, next) => {
    req.file_keys = [];
    let { file } = await utils.file_arranger(req.files);

    if(file !== undefined) {
        file = await validator.file_img(file);
    }

    req.connector = await db.get_connection();

    await service_member.update_profile_img(req, file);

    await db.commit(req.connector);

    res.json(true);
}, async (err, req, res, next) => {
    await utils.file_delete(req.file_keys);

    throw err;
});

router.post('/id_check', async (req, res, next) => {
    let { id } = req.body;

    await validator.str('id', req.body);

    try{
        await member.login_checker(req, res);
    }catch (e) {}

    await service_member.id_dup_check(req, id);

    res.json(true);
});

router.post('/email_check', async (req, res, next) => {
    let { email } = req.body;

    await validator.str('email', req.body);

    try{
        await member.login_checker(req, res);
    }catch (e) {}

    await service_member.email_dup_check(req, email);

    res.json(true);
});

router.post('/nick_check', async (req, res, next) => {
    let { nickname } = req.body;

    await validator.str('nickname', req.body);

    try{
        await member.login_checker(req, res);
    }catch (e) {}

    await service_member.nick_dup_check(req, nickname);

    res.json(true);
});

module.exports = router;
