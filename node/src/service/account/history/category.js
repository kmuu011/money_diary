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
    const { name, type } = req.body;
    const member_idx = req.member.idx;

    const dup_check = await dao_account_history_category.duplicate_check(member_idx, name, type);

    const color = await utils.create_color();
    const data_obj = { member_idx, name, type, color };

    const organized_sql = organizer.get_sql(data_obj, Object.keys(data_obj));

    if(dup_check.length !== 0){
        throw message.ALREADY_EXIST('이름');
    }

    return await dao_account_history_category.insert(req, organized_sql);
};

service_account_history_category.update = async (req) => {
    const member_idx = req.member.idx;

    const { name, color } = req.body;
    const type = req.category_info.type;
    const data_obj = { type, name, color };

    utils.object_delete_undefined(data_obj);

    const dup_check = await dao_account_history_category.duplicate_check(member_idx, name, type);

    if(dup_check.length !== 0){
        throw message.ALREADY_EXIST('이름');
    }

    const organized_sql = organizer.get_sql(data_obj, Object.keys(data_obj));

    return await dao_account_history_category.update(req, organized_sql);
};

service_account_history_category.delete = async (req) => {
    await dao_account_history_category.initialize_history(req);

    return await dao_account_history_category.delete(req);
};


module.exports = service_account_history_category;
