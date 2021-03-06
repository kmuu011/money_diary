const dao_account_history_category = {};
const message = require(`libs/message`);

const mysql = require('mysql');
const db = require(`libs/db`);

dao_account_history_category.select_list = async (member_idx, type) => {
    let sql = "SELECT idx, type, name, color " +
        "FROM account_history_category " +
        "WHERE member_idx = ? AND type = ?";
    sql = mysql.format(sql, [ member_idx, type ]);

    return await db.query(sql);
};

dao_account_history_category.select_one = async (member_idx, category_idx) => {
    let sql = "SELECT idx, type, name, `default`, color " +
        "FROM account_history_category " +
        "WHERE member_idx = ? AND idx = ?";
    sql = mysql.format(sql, [ member_idx, category_idx ]);

    return await db.query(sql);
};

dao_account_history_category.duplicate_check = async (member_idx, name, type) => {
    let sql = "SELECT idx FROM account_history_category " +
        "WHERE member_idx = ? AND type = ? AND name = ?";
    sql = mysql.format(sql, [ member_idx, type, name ]);

    return await db.query(sql);
};

dao_account_history_category.insert = async (req, organized_sql) => {
    const { sql_col, sql_val } = organized_sql;

    let sql = "INSERT INTO account_history_category (" + sql_col + " created_at, updated_at) " +
        "VALUES(" + sql_val + " UNIX_TIMESTAMP(), UNIX_TIMESTAMP())";

    const insert_color = await db.run(req.connector, sql);

    if(insert_color.affectedRows !== 1){
        throw message.SERVER_ERROR;
    }

    return true;
};

dao_account_history_category.update = async (req, organized_sql) => {
    const { sql_set } = organized_sql;

    let sql = "UPDATE account_history_category " +
        "SET " + sql_set;

    sql += " updated_at = UNIX_TIMESTAMP() " +
        "WHERE idx = ?";
    sql = mysql.format(sql, [ req.category_info.idx ]);

    const result = await db.query(sql);

    if (result.affectedRows !== 1){
        throw message.SERVER_ERROR;
    }

    return result;
};

dao_account_history_category.delete = async (req) => {
    let sql = "DELETE FROM account_history_category WHERE idx = ?";
    sql = mysql.format(sql, [ req.category_info.idx ]);

    const result = await db.run(req.connector, sql);

    if (result.affectedRows !== 1){
        throw message.SERVER_ERROR;
    }

    return result;
};

dao_account_history_category.initialize_history = async (req) => {
    const { idx: category_idx, type } = req.category_info;

    let sql = "SELECT count(*) cnt FROM account_history " +
        "WHERE category_idx = ?";
    sql = mysql.format(sql, [ category_idx ]);

    const result_cnt = await db.query(sql);

    sql = "UPDATE account_history SET category_idx = (SELECT idx FROM account_history_category " +
        "WHERE member_idx = ? AND type = ? AND `default` = 1) WHERE category_idx = ?";
    sql = mysql.format(sql, [ req.member.idx, type, category_idx ]);

    const result = await db.run(req.connector, sql);

    if(result_cnt[0].cnt !== result.affectedRows){
        throw message.SERVER_ERROR;
    }

    return result;
};


module.exports = dao_account_history_category;
