const service_sale_keyword = {};

const dao_sale_keyword = require(`dao/sale/keyword`);

const organizer = require(`libs/organizer`);
const utils = require(`libs/utils`);

service_sale_keyword.select = async (req) => {
    return await dao_sale_keyword.select(req);
};

service_sale_keyword.select_one = async (req, keyword_idx) => {
    return await dao_sale_keyword.select_one(req, keyword_idx);
};

service_sale_keyword.dup_check = async (req, keyword) => {
    return await dao_sale_keyword.dup_check(req, keyword);
};

service_sale_keyword.insert = async (req) => {
    let { keyword } = req.body;

    let data_obj = {
        keyword,
        member_idx: req.member.idx
    };

    req.organized_sql = await organizer.get_sql(data_obj, Object.keys(data_obj), undefined, 0);

    return await dao_sale_keyword.insert(req);
};

service_sale_keyword.delete = async (req) => {
    return await dao_sale_keyword.delete(req, req.keyword_info.idx);
};

module.exports = service_sale_keyword;
