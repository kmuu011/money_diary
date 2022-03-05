/**
 * 금융결제원의 오픈뱅킹 API는
 * 법인or개인 사업자가 있어야 가능하므로
 * 실제 계좌의 이용내역을 가져오는 기능은 개발 중단됨
*/


// const banking = {};
//
// const config = require(`config`);
// const utils = require(`libs/utils`);
//
// const request = require('request');
//
// let base_url = 'https://openapi.openbanking.or.kr';
// base_url = 'https://developers.kftc.or.kr';
//
// banking.check = async (code, rd_uri) => {
//     let options;
//     const url = base_url + '/proxy/oauth/2.0/token';
//
//     const access_data = await new Promise(async (resolve, reject) => {
//         options = {
//             method : 'POST',
//             url,
//             form: {
//                 code: code,
//                 grant_type: 'authorization_code',
//                 client_id: config.banking.client_id,
//                 client_secret: config.banking.client_secret,
//                 redirect_uri: 'http://127.0.0.1:8080/banking',
//             },
//             json:true
//         };
//
//         console.log(options.form)
//
//         request(options, function(err, response, body) {
//             resolve(body);
//         });
//     });
//
//     console.log(access_data)
//
//
//     return access_data;
// };
//
// banking.select_account = async (access_token, user_seq_no) => {
//     let options;
//      url = base_url + '/proxy/account/list?' +
//         'user_seq_no=' + user_seq_no + '&include_cancel_yn=N&sort_order=D';
//
//     console.log(url);
//
//     const access_data = await new Promise(async (resolve, reject) => {
//         options = {
//             method : 'GET',
//             uri : url,
//             headers: {
//                 'Authorization' : 'Bearer ' + access_token
//             },
//             json:true
//         };
//
//         request(options, function(err, response, body) {
//             resolve(body);
//         });
//     });
//
//     console.log(access_data)
//
//
//     return access_data;
// };
//
//
// banking.select_account_history = async (access_token, fintech_use_num) => {
//     let options;
//
//     const now_date_obj = await utils.get_date_parser(new Date());
//     const bank_tran_id = config.banking.unq_key + 'U' + await utils.create_key(9);
//
//     const tran_dtime = `${now_date_obj.year}${now_date_obj.month}${now_date_obj.dat}${now_date_obj.hour}${now_date_obj.minute}${now_date_obj.second}`;
//     const from_date = '20220101';
//     const to_date = '20220105';
//
//     let url = base_url + '/proxy/account/transaction_list/fin_num?';
//     url += 'bank_tran_id=' + bank_tran_id;
//     url += '&fintech_use_num=' + fintech_use_num;
//     url += '&inquiry_type=A';
//     url += '&inquiry_base=D';
//     url += '&from_date=' + from_date;
//     url += '&to_date=' + to_date;
//     url += '&sort_order=D';
//     url += '&tran_dtime=' + tran_dtime;
//
//     const access_data = await new Promise(async (resolve, reject) => {
//         options = {
//             method : 'GET',
//             uri : url,
//             headers: {
//                 'Authorization' : 'Bearer ' + access_token
//             },
//             json:true
//         };
//
//         request(options, function(err, response, body) {
//             resolve(body);
//         });
//     });
//
//     console.log(url);
//
//     console.log(access_data)
//
//
//     return access_data;
// };
//
// module.exports = banking;