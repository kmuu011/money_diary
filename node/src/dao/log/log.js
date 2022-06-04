const dao_log = {};
const message = require(`libs/message`);

const mysql = require('mysql');
const db = require(`libs/db`);


dao_log.insert_visit = async (req) => {
    const { sql_col, sql_val } = req.organized_sql;

    const sql = "INSERT " +
        "INTO visit_logs (" + sql_col + " created_at) " +
        "VALUES(" + sql_val + " UNIX_TIMESTAMP())";

    await db.query(sql);
};


module.exports = dao_log;
