const utils = require(`libs/utils`);
const organizer = require(`libs/organizer`);

const dao_sale_info = require(`dao/sale/info`);

const nodemailer = require(`libs/nodemailer`);
const logger = require(`libs/logger`);

const schedule = require('node-schedule');

const SERVER_TYPE = process.env.NODE_ENV || '';

const data_processor = async (data_list) => {
    for(let d of data_list){
        const dup_check = await dao_sale_info.select_one(d.unq_key);
        const obj = {};

        let organized_sql;

        for(const k in d){
            obj[k] = d[k].toString().replace(/\？/g, '?');
        }

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

                await nodemailer.send(m.nickname, m.email, '[특가정보] 등록하신 키워드의 할인정보가 올라왔어요!', html);
            }

        }else{
            organized_sql = await organizer.get_sql(d, 'state', undefined, 2);

            await dao_sale_info.update(organized_sql, d.unq_key);
        }
    }
};

const data_arranger_for_pp = async (list, By) => {
    const item_list = [];

    for(let l of list){
        const td = await l.findElements(By.tagName('td'));
        const unq_key = 'pp' + await td[0].getText();

        let obj = {};
        if(unq_key === 'pp') continue;

        const url = await td[2].findElement(By.tagName('a')).getAttribute('href');
        const title = await td[2].findElement(By.tagName('font')).getText();
        const price_type = '';
        const type = 1;

        let state = '진행중';
        let category;
        let price = '별도 확인';

        try {
            await td[2].findElement(By.className('list_title'));
        }catch (e) {
            state = '종료';
        }

        const span = await td[2].findElement(By.tagName('div')).findElements(By.tagName('span'));

        for(const s of span){
            const text = await s.getText();

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

(async () => {
    if(SERVER_TYPE !== 'scheduler') return;

    console.log('### 스케줄러 ON ###');

    /**
     * 퀘이사존, 뽐뿌 할인 정보 크롤링
     * */
    schedule.scheduleJob('0 * * * * *', async () => {
        const start_at = Date.now();

        const start_time_obj = await utils.get_date_parser(new Date());

        if(start_time_obj.minute % 5 !== 0) return;

        const { Builder, By } = require('selenium-webdriver');
        const chrome = require('selenium-webdriver/chrome');
        const options = new chrome.Options();
        options.addArguments('--incognito');
        options.addArguments('--headless');
        options.addArguments('--no-sandbox');
        options.addArguments("--single-process");
        options.addArguments("--disable-dev-shm-usage");

        const driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        let data_list = [];

        try {

            // 퀘이사존 크롤러
            await new Promise(async (resolve) => {
                try {
                    await driver.get('https://quasarzone.com/bbs/qb_saleinfo');

                    await utils.sleep(1);

                    const element_list = await driver.findElements(By.className('market-info-list'));

                    for (const e of element_list) {
                        const state = await e.findElement(By.className('label')).getText();
                        let title, obj;

                        try {
                            title = await e.findElement(By.className('ellipsis-with-reply-cnt')).getText();
                        } catch (e) {
                            continue;
                        }

                        const category = (await e.findElement(By.className('category')).getText()).replace(/\s/g, '');
                        const price = (await e.findElement(By.className('text-orange')).getText()).replace(/\s/g, '');
                        let new_price = '';
                        let type = 0;

                        for (let d of price) {
                            if ((/([0-9])|[.]/).test(d)) new_price += d;
                        }

                        const price_type = price[0];
                        const url = await e.findElement(By.className('subject-link')).getAttribute('href');
                        const unq_key = 'qz' + url.substring(url.lastIndexOf('/') + 1);

                        obj = {
                            title, category, price: new_price,
                            price_type, url, unq_key, state, type
                        };

                        data_list.push(obj);
                    }

                    if(data_list.length !== 0) {
                        data_list = await utils.arrange_data(data_list);

                        await data_processor(data_list);
                    }

                } catch (e) {
                    logger.error(e);
                    logger.error('퀘이사존 크롤러 오류');
                } finally {
                    resolve('');
                }
            });

            data_list = [];
            await utils.sleep(5);

            // 뽐뿌 크롤러
            await new Promise(async (resolve) => {
                try {
                    await driver.get('https://www.ppomppu.co.kr/zboard/zboard.php?id=ppomppu');

                    await utils.sleep(1);

                    const list0 = await driver.findElements(By.className('list0'));
                    const list1 = await driver.findElements(By.className('list1'));

                    data_list = [...await data_arranger_for_pp(list0, By), ...await data_arranger_for_pp(list1, By)];

                    if(data_list.length !== 0) {
                        data_list = await utils.arrange_data(data_list);

                        await data_processor(data_list);
                    }

                }catch (e) {
                    logger.error(e);
                    logger.error('뽐뿌 크롤러 오류');
                }finally {
                    resolve('');
                }
            });

        } catch (e) {
            logger.error(e);
            logger.error('크롤링 오류로 드라이버 종료');
            driver.quit();
        }finally {
            logger.info(`크롤러 완료 ${((Date.now()-start_at)/1000).toFixed(1)}초 소요`);
            driver.quit();
        }
    });

})();

