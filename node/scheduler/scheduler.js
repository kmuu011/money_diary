'use strict';
require('express-async-errors');
require('../global/index');
const express = require('express');
const app = express();
app.set("etag", false);

const utils = require(`libs/utils`);
const organizer = require(`libs/organizer`);

const dao_sale_info = require(`dao/sale/info`);

const nodemailer = require(`libs/nodemailer`);
const logger = require(`libs/logger`);

const schedule = require('node-schedule');

const SERVER_TYPE = process.env.NODE_ENV;

const Crawler = require("crawler");

const quasarzone_url = 'https://quasarzone.com';
const ppomppu_url = 'https://www.ppomppu.co.kr/zboard/';

const data_processor = async (data_list) => {
    for(const d of data_list){
        const dup_check = await dao_sale_info.select_one(d.unq_key);

        let organized_sql;

        if(dup_check.length === 0){
            organized_sql = await organizer.get_sql(d, Object.keys(d), undefined, 1);

            await dao_sale_info.insert(organized_sql);

            const member_list = await dao_sale_info.select_keyword_user(d.title);

            for(const k in d){
                if(!d.hasOwnProperty(k)) continue;

                d[k] = d[k].toString().replace(/\？/g, '?');
            }

            for(const m of member_list) {
                let html = nodemailer.storage.sale_info;
                html = html.replace(/#NICKNAME/g, m.nickname);
                html = html.replace(/#KEYWORD/g, m.keyword);
                html = html.replace(/#TITLE/g, d.title);
                html = html.replace(/#CATEGORY/g, d.category);
                html = html.replace(/#TARGET_URL/g, d.url);
                html = html.replace(/#PRICE_TYPE/g, d.price_type);
                html = html.replace(/#PRICE/g, await utils.comma_parser(d.price));

                await nodemailer.send(m.nickname, m.email, '[특가정보] 등록하신 키워드의 할인정보가 올라왔어요!', html);
            }

        }else{
            organized_sql = await organizer.get_sql(d, 'state', undefined, 2);

            await dao_sale_info.update(organized_sql, d.unq_key);
        }
    }
};

let data_arranger_for_pp = async (list, $) => {
    let item_list = [];

    list.each(function() {
        const url = ppomppu_url + $(this).find('table').find('a').attr('href');
        const title = $(this).find('table').find('a').text();
        const title_string = $(this).find('font.list_title').text();
        const price = '별도 확인';
        const price_type = '';
        const type = 1;
        const state = title_string === '' ? '종료' : '진행중';

        const temp_category = $(this).find('table').find('span').text();
        const category = temp_category.substring(temp_category.indexOf('[')+1, temp_category.indexOf(']')).replace(/\s/g, '');

        const unq_key = 'pp' + $(this).find('td:first-child.eng.list_vspace').text().replace(/\s/g, '');

        if(url.indexOf('view.php')-ppomppu_url.length === 0) {
            item_list.push({title, url, price, price_type, type, state, category, unq_key});
        }
    });

    return item_list;
};

(async () => {
    if(SERVER_TYPE !== 'scheduler') return;

    console.log('### 스케줄러 ON ###');

    /**
     * 퀘이사존, 뽐뿌 할인 정보 크롤링
     * */
    schedule.scheduleJob('0 * * * * *', async () => {
        const start_at = Date.now();

        // const start_time_obj = await utils.get_date_parser(new Date());
        // if(start_time_obj.minute % 5 !== 0) return;

        const connector = new Crawler({
            maxConnections: 1
        });

        //퀘이사존 크롤링
        connector.queue([{
            uri:'https://quasarzone.com/bbs/qb_saleinfo',
            callback: async function(err, response, done){
                const data_list = [];
                try {
                    if (err) {
                        throw err;
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

                }catch (e) {
                    logger.error(e);
                    logger.error('퀘이사존 크롤러 오류');
                }finally {
                    logger.info(`퀘이사존 크롤러 완료 ${((Date.now()-start_at)/1000).toFixed(1)}초 소요`);
                    done();
                }
            }
        }]);

        //뽐뿌 크롤링
        connector.queue([{
            uri:'https://www.ppomppu.co.kr/zboard/zboard.php?id=ppomppu',
            callback: async function(err, response, done){

                try {
                    if (err) {
                        throw err;
                    } else {
                        const $ = response.$;
                        const element = $('table#revolution_main_table');
                        const list0 = element.find('tr.list0');
                        const list1 = element.find('tr.list1');

                        const data_list = [...await data_arranger_for_pp(list0, $), ...await data_arranger_for_pp(list1, $)];

                        if (data_list.length !== 0) {
                            await utils.arrange_data(data_list);
                            await data_processor(data_list);
                        }
                    }

                } catch (e) {
                    logger.error(e);
                    logger.error('뽐뿌 크롤러 오류');
                } finally {
                    logger.info(`뽐뿌 크롤러 완료 ${((Date.now()-start_at)/1000).toFixed(1)}초 소요`);
                    done();
                }
            }
        }]);
    });

    // /**
    //  * selenium 기반 퀘이사존, 뽐뿌 할인 정보 크롤링
    //  * */
    // schedule.scheduleJob('0 * * * * *', async () => {
    //     const start_at = Date.now();
    //
    //     const start_time_obj = await utils.get_date_parser(new Date());
    //
    //     if(start_time_obj.minute % 5 !== 0) return;
    //
    //     const { Builder, By } = require('selenium-webdriver');
    //     const chrome = require('selenium-webdriver/chrome');
    //     const options = new chrome.Options();
    //     options.addArguments('--incognito');
    //     options.addArguments('--headless');
    //     options.addArguments('--no-sandbox');
    //     options.addArguments("--single-process");
    //     options.addArguments("--disable-dev-shm-usage");
    //
    //     const driver = await new Builder()
    //         .forBrowser('chrome')
    //         .setChromeOptions(options)
    //         .build();
    //
    //     let data_list = [];
    //
    //     try {
    //         // 퀘이사존 크롤러
    //         await new Promise(async (resolve) => {
    //             try {
    //                 await driver.get('https://quasarzone.com/bbs/qb_saleinfo');
    //
    //                 await utils.sleep(1);
    //
    //                 const element_list = await driver.findElements(By.className('market-info-list'));
    //
    //                 for (const e of element_list) {
    //                     const state = await e.findElement(By.className('label')).getText();
    //                     let title, obj;
    //
    //                     try {
    //                         title = await e.findElement(By.className('ellipsis-with-reply-cnt')).getText();
    //                     } catch (e) {
    //                         continue;
    //                     }
    //
    //                     const category = (await e.findElement(By.className('category')).getText()).replace(/\s/g, '');
    //                     const price = (await e.findElement(By.className('text-orange')).getText()).replace(/\s/g, '');
    //                     const type = 0;
    //                     let new_price = '';
    //
    //                     for (let d of price) {
    //                         if ((/([0-9])|[.]/).test(d)) new_price += d;
    //                     }
    //
    //                     const price_type = price[0];
    //                     const url = await e.findElement(By.className('subject-link')).getAttribute('href');
    //                     const unq_key = 'qz' + url.substring(url.lastIndexOf('/') + 1);
    //
    //                     obj = {
    //                         title, category, price: new_price,
    //                         price_type, url, unq_key, state, type
    //                     };
    //
    //                     data_list.push(obj);
    //                 }
    //
    //                 if(data_list.length !== 0) {
    //                     await utils.arrange_data(data_list);
    //
    //                     await data_processor(data_list);
    //                 }
    //
    //             } catch (e) {
    //                 logger.error(e);
    //                 logger.error('퀘이사존 크롤러 오류');
    //             } finally {
    //                 resolve('');
    //             }
    //         });
    //
    //         data_list = [];
    //         await utils.sleep(5);
    //
    //         // 뽐뿌 크롤러
    //         await new Promise(async (resolve) => {
    //             try {
    //                 await driver.get('https://www.ppomppu.co.kr/zboard/zboard.php?id=ppomppu');
    //
    //                 await utils.sleep(1);
    //
    //                 const list0 = await driver.findElements(By.className('list0'));
    //                 const list1 = await driver.findElements(By.className('list1'));
    //
    //                 data_list = [...await data_arranger_for_pp(list0, By), ...await data_arranger_for_pp(list1, By)];
    //
    //                 if(data_list.length !== 0) {
    //                     await utils.arrange_data(data_list);
    //
    //                     await data_processor(data_list);
    //                 }
    //
    //             }catch (e) {
    //                 logger.error(e);
    //                 logger.error('뽐뿌 크롤러 오류');
    //             }finally {
    //                 resolve('');
    //             }
    //         });
    //
    //     } catch (e) {
    //         logger.error(e);
    //         logger.error('크롤링 오류로 드라이버 종료');
    //         driver.quit();
    //     }finally {
    //         logger.info(`크롤러 완료 ${((Date.now()-start_at)/1000).toFixed(1)}초 소요`);
    //         driver.quit();
    //     }
    // });

})();

module.exports = app;
