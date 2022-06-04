const mysql = require('mysql');
const config = require(`config`);

const pool = {
    user : mysql.createPool(config.mysql_config),
    admin : mysql.createPool(config.mysql_config_admin),
    local : mysql.createPool(config.mysql_config_local)
};

module.exports = pool;