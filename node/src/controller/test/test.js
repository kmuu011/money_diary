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

const logger = require(`libs/logger`);

let sql;

const data_processor = async (data_list) => {
    for(const d of data_list){
        const dup_check = await dao_sale_info.select_one(d.unq_key);
        const obj = {};

        let organized_sql;

        console.log(dup_check)

        if(dup_check.length === 0){
            organized_sql = await organizer.get_sql(d, Object.keys(d), undefined, 1);

            await dao_sale_info.insert(organized_sql);

            const member_list = await dao_sale_info.select_keyword_user(d.title);

            for(const m of member_list) {
                let html = nodemailer.storage.sale_info;
                html = html.replace(/#NICKNAME/g, m.nickname);
                html = html.replace(/#KEYWORD/g, m.keyword);
                html = html.replace(/#TITLE/g, obj.title);
                html = html.replace(/#CATEGORY/g, obj.category);
                html = html.replace(/#TARGET_URL/g, obj.url);
                html = html.replace(/#PRICE_TYPE/g, obj.price_type);
                html = html.replace(/#PRICE/g, await utils.comma_parser(obj.price));

                // await nodemailer.send(m.nickname, m.email, '[특가정보] 등록하신 키워드의 할인정보가 올라왔어요!', html);
            }

        }else{
            organized_sql = await organizer.get_sql(d, 'state', undefined, 2);

            await dao_sale_info.update(organized_sql, d.unq_key);
        }
    }
};

let data_arranger_for_pp = async (list, By) => {
    let item_list = [];

    for(let l of list){
        let td = await l.findElements(By.tagName('td'));
        let obj = {};
        let unq_key = 'pp' + await td[0].getText();
        if(unq_key === 'pp') continue;

        let url = await td[2].findElement(By.tagName('a')).getAttribute('href');
        let title = await td[2].findElement(By.tagName('font')).getText();
        let state = '진행중';
        let category;
        let price = '별도 확인';
        let price_type = '';
        let type = 1;

        try {
            await td[2].findElement(By.className('list_title'));
        }catch (e) {
            state = '종료';
        }

        let span = await td[2].findElement(By.tagName('div')).findElements(By.tagName('span'));

        for(let s of span){
            let text = await s.getText();

            if(text.indexOf('[') !== -1) {
                category = text.replace(/\[/g, '').replace(/\]/g, '');
                break;
            }
        }

        obj = {unq_key, title, category, state, url, price, price_type, type};

        item_list.push(obj);
    }

    return item_list;
};

router.post('/ss', async (req, res, next) => {

    res.json(req.body);
});


router.post('/exam', async (req, res, next) => {
    let { money_list, goal_money } = req.body;

    for(let i=0 ; i<money_list.length ; i++){
        for(let j=i+1 ; j<money_list.length ; j++){
            if(money_list[j] > money_list[i]){
                let temp = money_list[i];
                money_list[i] = money_list[j];
                money_list[j] = temp;
            }
        }
    }

    let dummy_money = 0;
    let result = {};

    for(let m of money_list){
        let cnt = 0;

        while(true){
            if(dummy_money + m > goal_money) break;

            dummy_money += m;
            cnt++;
        }

        result[m] = cnt;
    }

    res.json(result);
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


const crawler = require("crawler");
const quasarzone_url = 'https://quasarzone.com';

router.post('/crawler', async (req, res, next) => {
    const connector = new crawler({
        maxConnections: 1
    });

    connector.queue([{
        uri:'https://quasarzone.com/bbs/qb_saleinfo',
        callback: async function(err, response, done){
            const data_list = [];

            try {
                if (err) {
                    console.log(err);
                } else {
                    let $ = response.$;
                    let element_list = $('div.market-type-list').find('table').find('tbody').children('tr');

                    element_list.each(function () {
                        let title;
                        const state = $(this).find('span.label').text();

                        try {
                            title = $(this).find('span.ellipsis-with-reply-cnt').text();
                        } catch (e) {
                            title = '제목오류';
                        }

                        const category = $(this).find('span.category').text().replace(/\s/g, '');
                        const temp_price = $(this).find('span.text-orange').text().replace(/\s/g, '');
                        const price_type = temp_price[0];
                        const price = temp_price.toString().split('')
                            .filter((s) => (/([0-9])|[.]/).test(s)).toString().replace(/\,/g, '');
                        const url = quasarzone_url + $(this).find('a.subject-link ').attr('href');
                        const unq_key = 'qz' + url.substring(url.lastIndexOf('/') + 1);
                        const type = 0;

                        if (title !== '제목오류') {
                            data_list.push({title, state, category, price, price_type, url, unq_key, type});
                        }
                    });
                }

                if (data_list.length !== 0) {
                    await utils.arrange_data(data_list);
                    await data_processor(data_list);
                }

            } catch (e) {
                console.log(e);
            } finally {
                done();
            }
        }
    }]);

    res.json(true);
});

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
