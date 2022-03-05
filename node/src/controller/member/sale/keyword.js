const express = require('express');
const router = express.Router();

const validator = require(`libs/validator`);
const member = require(`libs/member`);
const Message = require(`libs/message`);

const db = require(`libs/db`);

const service_sale_keyword = require(`service/sale/keyword`);
const service_member = require(`service/member/member`);

router.get('/', async (req, res, next) => {
    let rp = {};

    rp.items = await service_sale_keyword.select(req);

    res.json(rp);
});

router.post('/', async (req, res, next) => {
    await validator.str('keyword', req.body);

    let { keyword } = req.body;

    let dup_check = await service_sale_keyword.dup_check(req, keyword);

    if(dup_check.length !== 0){
        throw Message.ALREADY_EXIST('키워드');
    }

    let keyword_list = await service_sale_keyword.select(req);

    if(req.member.max_sale_keyword_cnt <= keyword_list.length) {
        throw Message.MAX_SALE_KEYWORD(req.member.max_sale_keyword_cnt);
    }

    req.connector = await db.get_connection();

    await service_sale_keyword.insert(req);

    await db.commit(req.connector);

    res.json(true);
});

router.use('/:keyword_idx', (() => {
    let router = express.Router({
        mergeParams: true
    });

    router.use(async (req, res, next) => {
        let { keyword_idx } = req.params;

        let keyword_info = await service_sale_keyword.select_one(req, keyword_idx);

        if(keyword_info.length === 0){
            throw Message.NOT_EXIST('키워드');
        }

        req.keyword_info = keyword_info[0];

        next();
    });

    router.delete('/', async (req, res, next) => {
        req.connector = await db.get_connection();

        await service_sale_keyword.delete(req);

        await db.commit(req.connector);
        res.json(true);
    });

    return router;
})());


module.exports = router;
