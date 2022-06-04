const service_account_history = {};
const message = require(`libs/message`);

const utils = require(`libs/utils`);

const dao_account_history = require(`dao/account/history/history`);
const dao_account_history_category = require(`dao/account/history/category`);

const organizer = require(`libs/organizer`);

service_account_history.selectOne = async (history_idx) => {
    return await dao_account_history.select_one(history_idx);
};

service_account_history.select = async (account_idx, page, count, type, year, month, date, category_idx) => {
    if(month !== undefined) month = utils.left_padding(month, 2, '0');
    if(date !== undefined) date = utils.left_padding(date, 2, '0');

    return await dao_account_history.select(account_idx, page, count, type, year, month, date, category_idx);
};

service_account_history.resetTotalAmount = async (account_idx) => {
    return await dao_account_history.reset_total_amount(account_idx);
};

service_account_history.select_daily_situation = async (account_idx, start, end) => {
    const result = await dao_account_history.select_daily_situation(account_idx, start, end);

    const rp = {};

    for(let r of result){
        rp[r.day] = {income: r.income, outcome: r.outcome};
    }

    return rp;
};

service_account_history.select_month_situation = async (account_idx, year, month) => {
    const year_month = utils.left_padding(year, 2, '0') + utils.left_padding(month, 2 ,'0');

    return await dao_account_history.select_month_situation(account_idx, year_month);
};

service_account_history.select_category_info = async (account_idx, type, year, month) => {
    if(month !== undefined) month = utils.left_padding(month, 2, '0');

    const data = await dao_account_history.select_category_info(account_idx, type, year, month);

    const labels = [];
    const backgroundColor = [];
    const dataList = [];
    const category_idx = [];
    const amount = [];
    let borderColor;
    let total_amount = 0;

    for(const d of data){
        total_amount += d.amount;
        amount.push(d.amount);
        labels.push(d.name);
        backgroundColor.push(d.color);
        category_idx.push(d.category_idx);
    }

    borderColor = backgroundColor;

    for(const d of data){
        dataList.push(Math.round(d.amount/total_amount*100));
    }

    return {
        labels,
        backgroundColor,
        borderColor,
        data: dataList,
        category_idx,
        amount,
        total_amount
    };
};

service_account_history.insert = async (req) => {
    const member_idx = req.member.idx;
    const account_idx = req.account_info.idx;
    const { category:category_idx, amount, content, type } = req.body;

    const data_obj = {
        account_idx,
        amount,
        content,
        type,
        category_idx
    };

    const category = await dao_account_history_category.select_one(member_idx, category_idx);

    if(category.length !== 1){
        throw message.WRONG_PARAM('category_idx');
    }

    const organized_sql = organizer.get_sql(data_obj, Object.keys(data_obj));

    const result = await dao_account_history.insert(req, organized_sql);

    await dao_account_history.reset_total_amount(req);

    return result;
};

service_account_history.update = async (req) => {
    const member_idx = req.member.idx;
    const { category:category_idx, amount, content, type } = req.body;

    const data_obj = {
        amount,
        content,
        type,
        category_idx
    };

    const category = await dao_account_history_category.select_one(member_idx, category_idx);

    if(category.length !== 1){
        throw message.WRONG_PARAM('category_idx');
    }

    const organized_sql = organizer.get_sql(data_obj, Object.keys(data_obj));

    const result = await dao_account_history.update(req, organized_sql);

    await dao_account_history.reset_total_amount(req);

    return result;
};

service_account_history.delete = async (req) => {
    const result = await dao_account_history.delete(req);

    await dao_account_history.reset_total_amount(req);

    return result;
};

module.exports = service_account_history;
