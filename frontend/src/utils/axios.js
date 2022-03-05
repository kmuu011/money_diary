import Axios from 'axios';
import config from 'config/config';
const axios = {};

let host = config.domain + 'api/';

axios.api = async (type, url, data, headers, options) => {
    let config = {
        method : type,
        url : host + url,
        data : data,
        headers : {}
    };

    let token = localStorage.getItem('x-token');

    if(token === undefined){
        window.location = '/';
        localStorage.removeItem('x-token');
        alert('로그인 정보가 존재하지 않습니다. 다시 로그인해주세요.');
        return;
    }

    config.headers['x-token'] = token;

    if(headers !== undefined){
        config.headers = {...config.headers, ...headers}
    }

    if (options !== undefined) {
        for (let k in options) {
            config[k] = options[k];
        }
    }

    try {
        let result = await Axios(config);
        let new_token = result.headers['x-new-token'];

        if(new_token !== undefined) {
            localStorage.setItem('x-token', new_token);
        }

        return result;
    }catch (e) {
        if(e?.response?.status === 401){
            localStorage.removeItem('x-token');
            window.location = '/';
        }
        return e?.response;
    }
};

axios.test = async (type, url, data, headers, options) => {
    let config = {
        method : type,
        url : 'https://nrsep.com/api/' + url,
        data : data,
        headers : {}
    };

    let token = localStorage.getItem('x-token');

    if(token === undefined){
        window.location = '/';
        localStorage.removeItem('x-token');
        alert('로그인 정보가 존재하지 않습니다. 다시 로그인해주세요.');
        return;
    }

    config.headers['x-token'] = token;

    if(headers !== undefined){
        config.headers = {...config.headers, ...headers}
    }

    if (options !== undefined) {
        for (let k in options) {
            config[k] = options[k];
        }
    }

    try {
        let result = await Axios(config);
        let new_token = result.headers['x-new-token'];

        if(new_token !== undefined) {
            localStorage.setItem('x-token', new_token);
        }

        return result;
    }catch (e) {
        if(e?.response?.status === 401){
            localStorage.removeItem('x-token');
            window.location = '/';
        }
        return e?.response;
    }
};

axios.call = async (type, url, data, headers, options) => {
    let config = {
        method : type,
        url : url,
        data : data,
        headers : {}
    };

    if(headers !== undefined){
        config.headers = {...config.headers, ...headers}
    }

    if (options !== undefined) {
        for (let k in options) {
            config[k] = options[k];
        }
    }

    try {
        let result = await Axios(config);

        return result;
    }catch (e) {
        return e?.response;
    }
};


export default axios;
