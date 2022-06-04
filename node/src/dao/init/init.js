const dao_init = {};
const db = require(`libs/db`);

dao_init.init_system_time = async () => {
    let sql = "SET GLOBAL time_zone='Asia/Seoul'";
    await db.admin(sql);

    return true;
};

module.exports = dao_init;
