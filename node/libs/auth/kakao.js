const kakao = {};

const config = require(`config`);

const REST_API_KEY = config.kakao.rest_api_key;

const request = require('request');

kakao.get_access_data = async (code, rd_uri) => {
    const uri = 'https://kauth.kakao.com/oauth/token';
    let options;

    const access_data = await new Promise(async (resolve, reject) => {
        options = {
            method : 'POST',
            uri,
            form: {
                grant_type: 'authorization_code',
                client_id: REST_API_KEY,
                redirect_uri: rd_uri,
                code: code
            },
            json:true
        };

        request(options, function(err, response, body) {
            resolve(body);
        });
    });

    if(access_data === undefined || access_data.access_token === undefined){
        return false;
    }

    return access_data;
};

kakao.get_member_detail_data = async (access_token) => {
    const uri = 'https://kapi.kakao.com/v2/user/me';
    let options;

    const member_data = await new Promise(async (resolve, reject) => {

        options = {
            method : 'POST',
            uri : uri,
            headers: {
                'Authorization' : 'Bearer ' + access_token
            },
            json:true
        };

        request(options, function(err, response, body){
            resolve(body);
        });
    });

    if(member_data.msg !== undefined){
        return false;
    }

    return member_data;
};

module.exports = kakao;
