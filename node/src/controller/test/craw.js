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

// router.use(member.admin_check());

const dao_mem = require(`dao/member/member`);
const dao_sale_info = require(`dao/sale/info`);

const nodemailer = require(`libs/nodemailer`);
const Crawler = require("crawler");
const quasarzone_url = 'https://quasarzone.com';
const ppomppu_url = 'https://www.ppomppu.co.kr/zboard/';

const logger = require(`libs/logger`);

let sql;

// const data_processor = async (data_list) => {
//     for (const d of data_list) {
//         const dup_check = await dao_sale_info.select_one(d.unq_key);
//
//         let organized_sql;
//
//         if (dup_check.length === 0) {
//             organized_sql = await organizer.get_sql(d, Object.keys(d), undefined, 1);
//
//             await dao_sale_info.insert(organized_sql);
//
//             const member_list = await dao_sale_info.select_keyword_user(d.title);
//
//             for (const m of member_list) {
//                 let html = nodemailer.storage.sale_info;
//                 html = html.replace(/#NICKNAME/g, m.nickname);
//                 html = html.replace(/#KEYWORD/g, m.keyword);
//                 html = html.replace(/#TITLE/g, d.title);
//                 html = html.replace(/#CATEGORY/g, d.category);
//                 html = html.replace(/#TARGET_URL/g, d.url);
//                 html = html.replace(/#PRICE_TYPE/g, d.price_type);
//                 html = html.replace(/#PRICE/g, await utils.comma_parser(d.price));
//
//                 await nodemailer.send(m.nickname, m.email, '[특가정보] 등록하신 키워드의 할인정보가 올라왔어요!', html);
//             }
//
//         } else {
//             organized_sql = await organizer.get_sql(d, 'state', undefined, 2);
//
//             await dao_sale_info.update(organized_sql, d.unq_key);
//         }
//     }
// };
//
// let data_arranger_for_pp = async (list, $) => {
//     let item_list = [];
//
//     list.each(function () {
//         const url = ppomppu_url + $(this).find('table').find('a').attr('href');
//         const title = $(this).find('table').find('a').text();
//         const title_string = $(this).find('font.list_title').text();
//         const price = '별도 확인';
//         const price_type = '';
//         const type = 1;
//         const state = title_string === '' ? '종료' : '진행중';
//
//         const temp_category = $(this).find('table').find('span').text();
//         const category = temp_category.substring(temp_category.indexOf('[') + 1, temp_category.indexOf(']')).replace(/\s/g, '');
//
//         const unq_key = 'pp' + $(this).find('td:first-child.eng.list_vspace').text().replace(/\s/g, '');
//
//         if (url.indexOf('view.php') - ppomppu_url.length === 0) {
//             item_list.push({title, url, price, price_type, type, state, category, unq_key});
//         }
//     });
//
//     return item_list;
// };
//
// router.post('/crawler', async (req, res, next) => {
//     const connector = new Crawler({
//         maxConnections: 1
//     });
//
//     //퀘이사존 크롤링
//     connector.queue([{
//         uri:'https://quasarzone.com/bbs/qb_saleinfo',
//         callback: async function(err, response, done){
//             const data_list = [];
//
//             try {
//                 if (err) {
//                     console.log(err);
//                 } else {
//                     const $ = response.$;
//                     const element_list = $('div.market-type-list').find('table').find('tbody').children('tr');
//
//                     element_list.each(function () {
//                         let title;
//                         const state = $(this).find('span.label').text();
//
//                         try {
//                             title = $(this).find('span.ellipsis-with-reply-cnt').text();
//                         } catch (e) {
//                             title = '제목오류';
//                         }
//
//                         const category = $(this).find('span.category').text().replace(/\s/g, '');
//                         const temp_price = $(this).find('span.text-orange').text().replace(/\s/g, '');
//                         const price_type = temp_price[0];
//                         const price = temp_price.toString().split('')
//                             .filter((s) => (/([0-9])|[.]/).test(s)).toString().replace(/\,/g, '');
//                         const url = quasarzone_url + $(this).find('a.subject-link ').attr('href');
//                         const unq_key = 'qz' + url.substring(url.lastIndexOf('/') + 1);
//                         const type = 0;
//
//                         if (title !== '제목오류') {
//                             data_list.push({title, state, category, price, price_type, url, unq_key, type});
//                         }
//                     });
//                 }
//
//                 if (data_list.length !== 0) {
//                     await utils.arrange_data(data_list);
//                     await data_processor(data_list);
//                 }
//
//             } catch (e) {
//                 console.log(e);
//             } finally {
//                 done();
//             }
//         }
//     }]);
//
//     //뽐뿌 크롤링
//     connector.queue([{
//         uri:'https://www.ppomppu.co.kr/zboard/zboard.php?id=ppomppu',
//         callback: async function(err, response, done){
//
//             try {
//                 if (err) {
//                     console.log(err);
//                 } else {
//                     const $ = response.$;
//                     const element = $('table#revolution_main_table');
//                     const list0 = element.find('tr.list0');
//                     const list1 = element.find('tr.list1');
//
//                     const data_list = [...await data_arranger_for_pp(list0, $), ...await data_arranger_for_pp(list1, $)];
//
//                     if (data_list.length !== 0) {
//                         await utils.arrange_data(data_list);
//                         await data_processor(data_list);
//                     }
//                 }
//
//             } catch (e) {
//                 console.log(e);
//             } finally {
//                 done();
//             }
//         }
//     }]);
//
//     res.json(true);
// });

// router.post('/crawler', async (req, res, next) => {
//     const { Builder, By, Key, until } = require('selenium-webdriver');
//     const chrome = require('selenium-webdriver/chrome');
//     const options = new chrome.Options();
//     // options.addArguments('--incognito');
//     // options.addArguments('--headless');
//     // options.addArguments('--no-sandbox');
//     // options.addArguments("--single-process");
//     // options.addArguments("--disable-dev-shm-usage");
//
//     let driver = await new Builder()
//         .forBrowser('chrome')
//         .setChromeOptions(options)
//         .build();
//
//     let data_list = [];
//
//     try {
//         await new Promise(async (resolve, reject) => {
//             try {
//                 await driver.get('https://quasarzone.com/bbs/qb_saleinfo');
//
//                 await utils.sleep(1);
//
//                 let element_list = await driver.findElements(By.className('market-info-list'));
//
//                 for (let e of element_list) {
//                     let obj;
//
//                     let state = await e.findElement(By.className('label')).getText();
//                     let title;
//
//                     try {
//                         title = await e.findElement(By.className('ellipsis-with-reply-cnt')).getText();
//                     }catch (e) {
//                         continue;
//                     }
//
//                     let category = (await e.findElement(By.className('category')).getText()).replace(/\s/g, '');
//                     let price = await e.findElement(By.className('text-orange')).getText();
//                     price = price.replace(/\s/g, '');
//                     let new_price = '';
//                     let type = 0;
//
//                     for (let d of price) {
//                         if ((/([0-9])|[.]/).test(d)) new_price += d;
//                     }
//
//                     let price_type = price[0];
//                     let url = await e.findElement(By.className('subject-link')).getAttribute('href');
//                     let unq_key = 'qz' + url.substring(url.lastIndexOf('/') + 1);
//
//                     obj = {
//                         title, category, price: new_price,
//                         price_type, url, unq_key, state, type
//                     };
//
//                     data_list.push(obj);
//                 }
//
//             }catch (e) {
//                 console.log(e);
//                 console.log('퀘이사존 크롤러 오류');
//             }finally {
//                 resolve('');
//             }
//         });
//
//         // console.log(data_list);
//
//         await utils.sleep(3);
//
//         await new Promise(async (resolve, reject) => {
//             try {
//                 await driver.get('https://www.ppomppu.co.kr/zboard/zboard.php?id=ppomppu');
//
//                 await utils.sleep(1);
//
//                 let list0 = await driver.findElements(By.className('list0'));
//                 let list1 = await driver.findElements(By.className('list1'));
//
//                 data_list = [...await data_arranger_for_pp(list0, By),
//                     ...await data_arranger_for_pp(list1, By)];
//
//             }catch (e) {
//                 console.log(e);
//                 console.log('뽐뿌 크롤러 오류');
//             }finally {
//                 resolve('');
//
//             }
//         });
//
//     }finally {
//
//         driver.quit();
//     }
//
//     res.json(true);
// });



module.exports = router;
