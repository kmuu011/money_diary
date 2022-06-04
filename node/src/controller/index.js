const express = require('express');
const router = express.Router();
const xss = require(`libs/xss`);
const utils = require(`libs/utils`);

const db = require(`libs/db`);

const message = require(`libs/message`);

const apis = [
    'member', 'account', 'auth', 'admin',
    'test'
];

router.use(async (req, res, next) => {
    xss.check(req.body);
    xss.check(req.query);

    utils.arrange_data(req.body);
    utils.arrange_data(req.query);
    
    next();
});

for(const api of apis){
    router.use('/' + api, require('./' + api + '/' + api));
}

router.use((req, res, next) => {
    res.status(404).json({
        message: 'API NOT FOUND',
    });
});


//next가 없을경우 에러가 정상적으로 처리되지 않음.
router.use(async (err, req, res, next) => {
    console.log(err);

    if(req.connector !== undefined){
        await db.rollback(req.connector);
    }

    if(err instanceof message){
        res.status(err.status).json(err);
        return
    }

    res.status(500).json('error');
});

module.exports = router;
