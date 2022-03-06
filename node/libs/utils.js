const utils = {};

const message = require(`libs/message`);
const fs = require('fs');

const mysql = require('mysql');
const db = require(`libs/db`);

const ran_str = 'QWERTYUIOPASDFGHJKLZXCVBNM0123456789';

const color_ran_str = '0123456789abcdef';

const request = require('request');

let sql;

utils.unique_check = async (table_name, key, col) => {
    if(col === undefined) col = 'idx';

    sql = "SELECT idx FROM " + table_name + " WHERE " + col + " = ?";
    sql = mysql.format(sql, [key]);

    const dup_check = await db.query(sql);

    return dup_check.length === 0;
};

utils.create_key = async (count, time) => {
    count = parseInt(count) || 20;

    let key = '';

    for (let i=0; i<count; i++) {
        const ran_int = Math.floor(Math.random() * ran_str.length);

        key += ran_str[ran_int];
    }

    if(time){
        key += '_' + Date.now();
    }

    return key;
};

utils.create_idx = async (table_name, count, col) => {
    let key;

    while(true){
        key = await utils.create_key(count);

        if(await utils.unique_check(table_name, key, col)) break;
    }

    return key;
};

utils.create_color = async () => {
    let color = '';

    for (let i=0 ; i<6 ; i++) {
        const ran_int = Math.ceil(Math.random() * color_ran_str.length);

        color += color_ran_str[ran_int];
    }

    return color;
};

utils.left_padding = async (value, count, str) => {
    if(value === undefined) return undefined;

    return value.toString().padStart(count, str);
};

utils.file_upload = async (key, buffer) => {
    if(fs.existsSync(BASE_PATH + key)){
        throw message.SERVER_ERROR;
    }

    try {
        fs.writeFileSync(BASE_PATH + key, buffer);
    }catch (e) {
        console.log(e);
        throw message.SERVER_ERROR;
    }

    return true;
};

utils.file_delete = async (key_list) => {
    if(key_list === undefined) return;

    for(let key of key_list) {
        key = BASE_PATH + "/" + key;

        if (fs.existsSync(key)) {
            try {
                fs.unlinkSync(key);
            } catch (e) {
                console.log(e);
                throw message.SERVER_ERROR;
            }
        }
    }

    return true;
};

utils.file_url_to_buffer = async (uri) => {
    const options = {
        method : 'GET',
        uri,
        encoding:null
    };

    return await new Promise(async (resolve, reject) => {
        request(options, function(err, response, body) {
            let buffer = Buffer.from(body, 'binary');

            resolve(buffer);
        })
    });
};

utils.file_arranger = async (files) => {
    const storage = {};

    if(files !== undefined) {
        for (const f of files) {
            const k = f.fieldname;

            if (k === undefined) {
                throw message.WRONG_PARAM('파일 구분');
            }

            if (storage[k] === undefined) {
                storage[k] = [f];
            } else {
                storage[k].push(f);
            }
        }
    }

    return storage;
};

utils.object_delete_undefined = async (data_obj) => {
    for(const k in data_obj){
        if(data_obj[k] === undefined) delete data_obj[k];
    }
};

utils.arrange_data = async (data) => {
    if(data.constructor === Array && data.length !== 0){
        for(let i=0 ; i<data.length ; i++){
            if(data[i] === undefined || data[i] === null) continue;

            if((data[i].constructor === Array && data[i].length !== 0) || data[i].constructor === Object){
                await utils.arrange_data(data[i]);
            }else if(data[i].constructor === String){
                data[i] = data[i].toString().replace(/\?/g, '？');
            }
        }
    }else if(data.constructor === Object && Object.keys(data).length !== 0){
        for(const k in data){
            if(!data.hasOwnProperty(k)) continue;

            if(data[k] === undefined || data[k] === null) continue;

            if((data[k].constructor === Array && data[k].length !== 0) || data[k].constructor === Object){
                await utils.arrange_data(data[k]);
            }else if(data[k].constructor === String){
                data[k] = data[k].toString().replace(/\?/g, '？');
            }
        }
    }
};

utils.get_date_parser = async (date) => {
    const year = date.getFullYear();
    const month = (parseInt(date.getMonth()) + 1).toString().padStart(2, '0');
    const dat = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const second = date.getSeconds().toString().padStart(2, '0');

    return { year, month, dat, hour, minute, second, ms: date.getTime() };
};

utils.sleep = async (second) => {
    await new Promise(async (resolve) => {
        setTimeout(function() {
            resolve('awake up');
        }, second*1000);
    });
};

utils.comma_parser = function(number){
    number = isNaN(parseInt(number)) === true ? number.toLocaleString() : parseInt(number).toLocaleString();

    return number;
};

module.exports = utils;
