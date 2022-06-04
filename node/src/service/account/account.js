const organizer = require(`libs/organizer`);

const service_account = {};

const dao_account = require(`dao/account/account`);

service_account.select_one = async (account_idx) => {
    return await dao_account.select_one(account_idx);
};

service_account.select_list = async (member_idx) => {
    return await dao_account.select_list(member_idx);
};

service_account.insert = async (req) => {
    return await dao_account.insert(req);
};

service_account.update = async (req) => {
    const { account_name, invisible_amount } = req.body;

    const data_obj = {account_name, invisible_amount};

    req.organized_sql = organizer.get_sql(data_obj, Object.keys(data_obj));

    return await dao_account.update(req);
};

service_account.delete = async (account_idx) => {
    return await dao_account.delete(account_idx);
};


module.exports = service_account;
