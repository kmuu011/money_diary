const express = require('express');
const router = express.Router();

const Message = require(`libs/message`);

const validator = require(`libs/validator`);

const db = require(`libs/db`);

const service_account_history_category = require(`service/account/history/category`);

router.get('/', async (req, res, next) => {
    let { type } = req.query;

    if(type === undefined && type !== 0 && type !== 1){
        throw Message.INVALID_PARAM('type');
    }

    res.json(await service_account_history_category.select_list(req.member.idx, type));
});

router.post('/', async (req, res, next) => {
    let { type } = req.body;

    await validator.str('name', req.body);
    await validator.int('type', req.body);

    req.connector = await db.get_connection();

    if(type !== 1 && type !== 0){
        throw Message.WRONG_PARAM('type');
    }

    await service_account_history_category.insert(req);

    await db.commit(req.connector);

    res.json(true);

});

router.use('/:category_idx(\\d+)', (() => {
    let router = express.Router({
        mergeParams: true
    });

    router.use(async (req, res, next) => {
        let { category_idx } = req.params;

        let result = await service_account_history_category.select_one(req.member.idx, category_idx);

        if(result.length !== 1){
            throw Message.NOT_EXIST('유형');
        }

        req.category_info = result[0];

        next();
    });

    router.patch('/', async (req, res, next) => {
        let { name, color } = req.body;

        if(req.category_info.default === 1 && name !== undefined){
            throw Message.CAN_NOT_ACTION_DEFAULT;
        }

        if(name === undefined && color === undefined){
            throw Message.INVALID_PARAM('parameter');
        }

        if(color !== undefined && color.length > 6){
            throw Message.WRONG_PARAM('color');
        }

        req.connector = await db.get_connection();

        await service_account_history_category.update(req);

        await db.commit(req.connector);

        res.json(true);
    });

    router.delete('/', async (req, res, next) => {
        if(req.category_info.default === 1){
            throw Message.CAN_NOT_ACTION_DEFAULT;
        }

        req.connector = await db.get_connection();

        await service_account_history_category.delete(req);

        await db.commit(req.connector);

        res.json(true);
    });

    return router;
})());


module.exports = router;
