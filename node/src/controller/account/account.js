const express = require('express');
const router = express.Router();

const validator = require(`libs/validator`);
const member = require(`libs/member`);
const Message = require(`libs/message`);

const db = require(`libs/db`);

const service_account = require(`service/account/account`);

router.use(member.login_check());

router.get('/', async (req, res, next) => {
    let result = await service_account.select_list(req.member.idx);

    res.json(result);
});

router.post('/', async (req, res, next) => {
    await validator.str('account_name', req.body);

    req.connector = await db.get_connection();

    await service_account.insert(req);

    await db.commit(req.connector);

    res.json(true);
});

router.use('/:account_idx(\\d+)', (() => {
    let router = express.Router({
        mergeParams: true
    });

    router.use(async (req, res, next) => {
        let { account_idx } = req.params;

        let result = await service_account.select_one(account_idx);

        if(result.length === 0){
            throw Message.NOT_EXIST('가계부');
        }

        //자신의 가계부인지 체크
        if(result[0].member_idx !== req.member.idx){
            throw Message.FORBIDDEN;
        }

        req.account_info = result[0];

        next();
    });

    router.get('/', async (req, res, next) => {
        res.json({account: req.account_info});
    });

    router.patch('/', async (req, res, next) => {
        await validator.str('account_name', req.body);
        await validator.int('invisible_amount', req.body);

        req.connector = await db.get_connection();

        await service_account.update(req);

        await db.commit(req.connector);

        res.json(true);
    });


    router.delete('/', async (req, res, next) => {
        await service_account.delete(req.account_info.idx);

        res.json(true);
    });


    router.use('/history', require('./history/history'));

    return router;
})());



module.exports = router;
