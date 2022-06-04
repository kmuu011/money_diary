const service_log = {};

const dao_log = require(`dao/log/log`);

const organizer = require(`libs/organizer`);

const utils = require(`libs/utils`);

service_log.insert_visit = async (req) => {
    const ip = req.headers.ip;
    const user_agent = req.headers['user-agent'];
    const url = req.url;
    const member_idx = req?.member?.idx;

    const data_obj = {ip, user_agent, url, member_idx};

    utils.arrange_data(data_obj);

    req.organized_sql = organizer.get_sql(data_obj, Object.keys(data_obj));

    await dao_log.insert_visit(req);
};

module.exports = service_log;
