const express = require('express');
const router = express.Router();
const xss = require(`libs/xss`);
const utils = require(`libs/utils`);

const db = require(`libs/db`);

const Message = require(`libs/message`);

let apis = [
    'member', 'account', 'auth', 'admin',
    'test'
];

router.use(async (req, res, next) => {
    req.body = await xss.check(req.body);
    req.query = await xss.check(req.query);

    req.body = await utils.arrange_data(req.body);
    req.query = await utils.arrange_data(req.query);
    
    next();
});

for(let api of apis){
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

    if(err instanceof Message){
        res.status(err.status).json(err);
        return
    }

    res.status(500).json('error');
});

module.exports = router;
