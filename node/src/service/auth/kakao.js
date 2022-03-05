const service_auth_kakao = {};
const Message = require(`libs/message`);

const config = require(`config`);

const utils = require(`libs/utils`);

const validator = require(`libs/validator`);
const member = require(`libs/member`);

const auth_kakao = require(`libs/auth/kakao`);
const organizer = require(`libs/organizer`);

const dao_auth_kakao = require(`dao/auth/kakao`);
const dao_member = require(`dao/member/member`);

const service_member = require(`service/member/member`);

service_auth_kakao.get_token = async (code, rd_uri) => {
    if(SERVER_TYPE === 'development'){
        rd_uri += ':8081';
    }

    rd_uri += '/api/auth/kakao';

    let access_data = await auth_kakao.get_access_data(code, rd_uri);

    if(access_data === false){
        throw Message.DETAIL_ERROR('로그인 토큰 정보가 잘못되었습니다. 다시 시도해주세요.');
    }

    return access_data;
};

service_auth_kakao.select_to_auth_id = async (auth_id) => {
    let exist_check = await dao_auth_kakao.exist_check(auth_id);

    let login_token;

    if(exist_check.length !== 0){
        login_token = await member.token(exist_check[0]);
    }

    return login_token;
};

service_auth_kakao.get_member_data = async (token, keep_check, req) => {
    let ip = req?.headers?.ip;
    let user_agent = req?.headers['user-agent'];
    let data_obj = {ip, user_agent};
    let member_idx;

    let member_data = await auth_kakao.get_member_detail_data(token);

    if(member_data === false){
        throw Message.DETAIL_ERROR('로그인 토큰 정보가 잘못되었습니다. 다시 시도해주세요.');
    }

    let auth_id = member_data.id;
    let detail_data = member_data.kakao_account;

    let nickname, profile_image, email;

    if(detail_data !== undefined){
        if(detail_data.profile !== undefined) {
            nickname = detail_data.profile.nickname;
            profile_image = detail_data.profile.profile_image_url;
        }
        email = detail_data.email;
    }

    let exist_check = await dao_auth_kakao.exist_check(auth_id);

    if(exist_check.length === 0){
        return { auth_id, nickname, profile_image, email };
    }

    exist_check = exist_check[0];

    exist_check.id = 'SNS 연동 계정';

    exist_check.ip = ip;
    exist_check.user_agent = user_agent;
    exist_check.keep_check = keep_check;
    member_idx = exist_check.idx;

    let login_token = await member.token(exist_check);

    console.log(data_obj);

    req.organized_sql = await organizer.get_sql(data_obj, Object.keys(data_obj));

    await dao_member.update_member(req, member_idx);

    return { 'x-token' : login_token };
};

service_auth_kakao.sign_up = async (req) => {
    let { nickname, email, auth_data } = req.body;

    auth_data.id = 'kakao_' + auth_data.auth_id;
    auth_data.password = await member.encrypt(auth_data.id);
    auth_data.nickname = nickname;
    auth_data.email = email;
    auth_data.auth_type = member.auth_type.kakao;

    if(auth_data.profile_image !== undefined){
        let key;

        try {
            let file = {};

            file.buffer = await utils.file_url_to_buffer(auth_data.profile_image);
            file.originalname = 'dummy' + auth_data.profile_image.substring(auth_data.profile_image.lastIndexOf('.'));
            file.size = file.buffer.length;

            let img = await validator.file_img([file]);

            while(true){
                key = await utils.create_key(28);
                key = config.files.imgs.profile + key + '.' + img[0].type;
                if(await dao_member.profile_img_check(key)) break;
            }

            auth_data.profile_image_key = key;

            await utils.file_upload(key, file.buffer);
        }catch (err) {
            auth_data.profile_image_key = undefined;
            await utils.file_delete(['/' + key]);
        }
    }

    let organized_sql = await organizer.get_sql(auth_data,
        "id, nickname, password, email, auth_type, auth_id, profile_img_key");

    let sign_up_info = await dao_auth_kakao.sign_up(req, organized_sql);

    req.member = {
        idx: sign_up_info.insertId
    };

    await service_member.starter_setting(req);

    return sign_up_info;
};

service_auth_kakao.member_link = async (req, auth_id) => {
    let { id, password } = req.body;
    password = await member.encrypt(password);

    let member_info = await dao_member.login(id, password);
    
    let member_link = await dao_auth_kakao.member_link(req.connector, member_info, auth_id);

    if(member_link.affectedRows !== 1){
        throw Message.SERVER_ERROR;
    }

    member_info['x-token'] = await member.token(member_info);

    return member_info;
};

module.exports = service_auth_kakao;
