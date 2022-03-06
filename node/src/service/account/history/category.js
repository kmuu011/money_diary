const service_account_history_category = {};

const message = require(`libs/message`);
const organizer = require(`libs/organizer`);
const utils = require(`libs/utils`);

const dao_account_history_category = require(`dao/account/history/category`);

service_account_history_category.select_list = async (member_idx, type) => {
    return await dao_account_history_category.select_list(member_idx, type);
};

service_account_history_category.select_one = async (member_idx, category_idx) => {
    return await dao_account_history_category.select_one(member_idx, category_idx);
};

service_account_history_category.insert = async (req) => {
    let { name, type } = req.body;
    let member_idx = req.member.idx;

    let dup_check = await dao_account_history_category.duplicate_check(member_idx, name, type);

    let color = await utils.create_color();
    let data_obj = { member_idx, name, type, color };

    let organized_sql = await organizer.get_sql(data_obj, Object.keys(data_obj));

    if(dup_check.length !== 0){
        throw message.ALREADY_EXIST('이름');
    }

    return await dao_account_history_category.insert(req, organized_sql);
};

service_account_history_category.update = async (req) => {
    let member_idx = req.member.idx;

    let { name, color } = req.body;
    let type = req.category_info.type;
    let data_obj = { type, name, color };

    await utils.object_delete_undefined(data_obj);

    let dup_check = await dao_account_history_category.duplicate_check(member_idx, name, type);

    if(dup_check.length !== 0){
        throw message.ALREADY_EXIST('이름');
    }

    let organized_sql = await organizer.get_sql(data_obj, Object.keys(data_obj));

    return await dao_account_history_category.update(req, organized_sql);
};

service_account_history_category.delete = async (req) => {
    await dao_account_history_category.initialize_history(req);

    return await dao_account_history_category.delete(req);
};


module.exports = service_account_history_category;
