const express = require('express');

const message = require(`libs/message`);

const validator = require(`libs/validator`);
const db = require(`libs/db`);

const router = express.Router({
    mergeParams: true
});

const service_account_history = require(`service/account/history/history`);

router.use('/category', require('./category'));

router.get('/', async (req, res, next) => {
    const rp = {};
    const account = req.account_info;
    const { type, year, month, date, category_idx } = req.query;
    let { page, count } = req.query;

    page = parseInt(page) || 1;
    count = parseInt(count) || 20;

    const { items, total_count } = await service_account_history.select(account.idx, page, count, type, year, month, date, category_idx);

    rp.items = items;
    rp.page = page;
    rp.count = count;
    rp.total_count = total_count;
    rp.last = Math.ceil(total_count/count) || 1;

    res.json(rp);
});

router.get('/daily_situation', async (req, res, next) => {
    const account = req.account_info;
    const { start, end } = req.query;

    const result = await service_account_history.select_daily_situation(account.idx, start, end);

    res.json(result);
});

router.get('/month_situation', async (req, res, next) => {
    const account = req.account_info;
    const { year, month } = req.query;

    const result = await service_account_history.select_month_situation(account.idx, year, month);

    res.json(result[0]);
});

router.get('/chart_setting', async (req, res, next) => {
    const account = req.account_info;
    const { type, year, month } = req.query;

    validator.data('type, year', req.query);

    const result = await service_account_history.select_category_info(account.idx, type, year, month);

    res.json(result);
});

router.post('/', async (req, res, next) => {
    const { type } = req.body;

    validator.str('content', req.body);
    validator.int('amount, type, category', req.body);

    if(type !== 0 && type !== 1){
        throw message.WRONG_PARAM('type');
    }

    req.connector = await db.get_connection();

    await service_account_history.insert(req);

    await db.commit(req.connector);

    res.json(true);
});

router.use('/:history_idx(\\d+)', (() => {
    const router = express.Router({
        mergeParams: true
    });

    router.use(async (req, res, next) => {
        const { history_idx } = req.params;

        const result = await service_account_history.selectOne(history_idx);

        if(result.length !== 1){
            throw message.NOT_EXIST('history');
        }

        if(result[0].member_idx !== req.member.idx){
            throw message.FORBIDDEN;
        }

        req.history_info = result[0];

        next();
    });

    router.patch('/', async (req, res, next) => {
        const { type } = req.body;

        validator.str('content', req.body);
        validator.int('amount, type, category', req.body);

        if(type !== 0 && type !== 1){
            throw message.WRONG_PARAM('type');
        }

        req.connector = await db.get_connection();

        await service_account_history.update(req);

        await db.commit(req.connector);

        res.json(true);
    });

    router.delete('/', async (req, res, next) => {
        req.connector = await db.get_connection();

        await service_account_history.delete(req);

        await db.commit(req.connector);

        res.json(true);
    });

    return router;
})());





module.exports = router;
