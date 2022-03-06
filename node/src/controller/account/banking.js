/**
 * 금융결제원의 오픈뱅킹 API는
 * 법인or개인 사업자가 있어야 가능하므로
 * 실제 계좌의 이용내역을 가져오는 기능은 개발 중단됨
 */

// const express = require('express');
// const router = express.Router();
//
// const validator = require(`libs/validator`);
// const member = require(`libs/member`);
// const message = require(`libs/message`);
//
// const db = require(`libs/db`);
// const banking = require(`libs/banking`);
//
//
//
// router.get('/', async (req, res, next) => {
//     let query = req.query;
//     let access_token, user_seq_no;
//     console.log(query);
//
//     let data = await banking.check(query.code);
//     access_token = data.access_token;
//     user_seq_no = data.user_seq_no;
//
//     data = await banking.select_account(access_token, data.user_seq_no);
//
//     data = data.res_list[0];
//
//     data = await banking.select_account_history(access_token, data.fintech_use_num);
//
//     res.json(data);
// });
//
//
// module.exports = router;
