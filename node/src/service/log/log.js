const service_log = {};

const dao_log = require(`dao/log/log`);

const organizer = require(`libs/organizer`);

const utils = require(`libs/utils`);

service_log.insert_visit = async (req) => {
    let ip = req.headers.ip;
    let user_agent = req.headers['user-agent'];
    let url = req.url;
    let member_idx = req?.member?.idx;

    let data_obj = {ip, user_agent, url, member_idx};

    await utils.arrange_data(data_obj);

    req.organized_sql = await organizer.get_sql(data_obj, Object.keys(data_obj));

    await dao_log.insert_visit(req);
};

module.exports = service_log;
