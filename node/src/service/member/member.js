const service_member = {};

const dao_member = require(`dao/member/member`);
const dao_account_history_category = require(`dao/account/history/category`);
const dao_account = require(`dao/account/account`);

const config = require(`config`);

const organizer = require(`libs/organizer`);

const utils = require(`libs/utils`);

const member = require(`libs/member`);

service_member.select_member = async (member_idx) => {
    return await dao_member.select_member(member_idx);
};

service_member.login = async (id, password, keep_check, req) => {
    const ip = req.headers.ip;
    const user_agent = req.headers['user-agent'];
    const data_obj = {ip, user_agent};

    password = await member.encrypt(password);

    const mem = await dao_member.login(id, password);

    mem.keep_check = keep_check;
    mem.ip = ip;
    mem.user_agent = user_agent;

    mem['x-token'] = await member.token(mem);

    req.organized_sql = organizer.get_sql(data_obj, Object.keys(data_obj));

    await dao_member.update_member(req, mem.idx);

    return mem;
};

service_member.starter_setting = async (req) => {
    for(const t of config.default_account_history_category){
        const data_obj = {
            member_idx: req.member.idx,
            name: t.name,
            type: t.type,
            color: utils.create_color(),
            default: t.default || 0
        };

        const organized_sql = organizer.get_sql(data_obj, Object.keys(data_obj));

        await dao_account_history_category.insert(req, organized_sql);
    }

    req.body.account_name = '기본 가계부';

    await dao_account.insert(req);
};

service_member.sign_up = async (req) => {
    req.body.password = await member.encrypt(req.body.password);

    const { id, password, email, nickname } = req.body;

    const data_obj = { id, password, email, nickname };

    req.organized_sql = organizer.get_sql(data_obj, Object.keys(data_obj));

    const sign_up_info = await dao_member.sign_up(req);

    req.member = { idx: sign_up_info.insertId };

    await service_member.starter_setting(req);

    return sign_up_info;
};

service_member.update_member = async (req) => {
    const { email, nickname } = req.body;
    let { password } = req.body;
    const data_obj = { email, nickname };

    if(email !== req.member.email){
        await dao_member.email_dup_check(email);
    }

    if(password !== undefined){
        password = await member.encrypt(password);
        data_obj.password = password;
    }

    req.organized_sql = organizer.get_sql(data_obj, Object.keys(data_obj));

    return await dao_member.update_member(req);
};

service_member.update_profile_img = async (req, file) => {
    let key = undefined;

    const { profile_img_key: before_profile_img_key } = req.member;

    //파일을 업로드 하지 않으면 프로필 이미지 초기화
    if(file !== undefined) {
        while (true) {
            key = utils.create_key(28);
            key = config.files.imgs.profile + key + '.' + file[0].type;
            if (await utils.unique_check('member', key, 'profile_img_key')) break;
        }

        await utils.file_upload(key, file[0].buffer);
        req.file_keys.push(key);
    }

    await dao_member.update_profile_img(req, key);

    if(before_profile_img_key !== undefined && before_profile_img_key !== null){
        await utils.file_delete([before_profile_img_key]);
    }

    return true;
};

service_member.update_mailing_test_at = async (req) => {
    return await dao_member.update_mailing_test_at(req);
};

service_member.id_dup_check = async (req, id) => {
    if(id === req?.member?.id) return true;

    return await dao_member.id_dup_check(id);
};

service_member.email_dup_check = async (req, email) => {
    if(email === req?.member?.email) return true;

    return await dao_member.email_dup_check(email);
};

service_member.nick_dup_check = async (req, nickname) => {
    if(nickname === req?.member?.nickname) return true;

    return await dao_member.nick_dup_check(nickname);
};

service_member.old_pwd_check = async (member_idx, old_password) => {
    old_password = await member.encrypt(old_password);

    return await dao_member.old_pwd_check(member_idx, old_password);
};

module.exports = service_member;
