const dao_log = {};
const Message = require(`libs/message`);

const mysql = require('mysql');
const db = require(`libs/db`);

let sql;

dao_log.insert_visit = async (req) => {
    let { sql_col, sql_val } = req.organized_sql;

    sql = "INSERT INTO visit_logs (" + sql_col + " created_at) VALUES(" + sql_val + " UNIX_TIMESTAMP())";

    await db.query(sql);
};


module.exports = dao_log;
