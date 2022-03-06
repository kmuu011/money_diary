const express = require('express');
const router = express.Router();
const config = require(`config`);

const mysql = require('mysql');
const message = require(`libs/message`);
const db = require(`libs/db`);
const db_local = require(`libs/db_local`);

const utils = require(`libs/utils`);
const cipher = require(`libs/cipher`);
const validator = require(`libs/validator`);
const organizer = require(`libs/organizer`);

const member = require(`libs/member`);

const dao_mem = require(`dao/member/member`);
const dao_sale_info = require(`dao/sale/info`);

const nodemailer = require(`libs/nodemailer`);

const logger = require(`libs/logger`);

let sql;

router.use('/craw', require('./craw'));


router.post('/ss', async (req, res, next) => {

    res.json(req.body);
});

let original_test_list = [
    {idx : 3},
    {idx : 2}
];

// 두 배열 비교
router.post('/es6_practice1', async (req, res, next) => {
    let test_list = [
        {"idx": 5},
        {"idx": 3},
        {"idx": 4},
    ];

    let new_item_list, removed_item_list;

    removed_item_list = await original_test_list.filter(item => (
        test_list.findIndex(item2 => (item2.idx === item.idx)) === -1
    ));

    new_item_list = await test_list.filter(item => (
        original_test_list.findIndex(item2 => (item2.idx === item.idx)) === -1
    ));

    res.json({
        new_item_list,
        removed_item_list
    });
});

// reduce 연습
router.post('/es6_practice2', async (req, res, next) => {
    let test_list = "1,2,3,4,5,6";

    test_list = test_list.replace(/\s/g, '').split(',');

    let sum = await test_list.reduce((acc, item, i, self) => {
        return parseInt(acc) + parseInt(item);
    });


    res.json(sum);
});


// some 연습
router.post('/es6_practice3', async (req, res, next) => {
    let test_list = [
        {"idx": 2},
        {"idx": 4},
    ];

    let result = await test_list.some((item) => {
        return original_test_list.findIndex(item2 => (
            item2.idx === item.idx
        )) !== -1;
    });


    res.json(result);
});

module.exports = router;
