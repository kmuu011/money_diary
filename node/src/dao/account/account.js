const dao_account = {};
const Message = require(`libs/message`);

const mysql = require('mysql');
const db = require(`libs/db`);

let sql;

dao_account.select_one = async (account_idx) => {
    sql = "SELECT idx, member_idx, total_amount, account_name, invisible_amount " +
        "FROM account WHERE idx = ?";
    sql = mysql.format(sql, [ account_idx ]);

    return await db.query(sql);
};

dao_account.select_list = async (member_idx) => {
    sql = "SELECT idx, total_amount, account_name, invisible_amount " +
        "FROM account WHERE member_idx = ? " +
        "ORDER BY idx";
    sql = mysql.format(sql, [ member_idx ]);

    return await db.query(sql);
};

dao_account.insert = async (req) => {
    let { account_name } = req.body;

    sql = 'INSERT INTO account (member_idx, account_name, created_at, updated_at) ' +
        'VALUES(?, ?, UNIX_TIMESTAMP(), UNIX_TIMESTAMP())';
    sql = mysql.format(sql, [ req.member.idx, account_name ]);

    let result = await db.run(req.connector, sql);

    if(result.affectedRows !== 1){
        throw Message.SERVER_ERROR;
    }

    return result;
};

dao_account.update = async (req) => {
    let { sql_set } = req.organized_sql;

    sql = "UPDATE account " +
        "SET " + sql_set + " updated_at = UNIX_TIMESTAMP() " +
        "WHERE idx = ?";
    sql = mysql.format(sql, [ req.account_info.idx ]);

    let result = await db.query(sql);

    if(result.affectedRows !== 1){
        throw Message.SERVER_ERROR;
    }

    return result;
};


dao_account.delete = async (account_idx) => {
    sql = "DELETE FROM account WHERE idx = ?";
    sql = mysql.format(sql, [ account_idx ]);

    let result = await db.query(sql);

    if(result.affectedRows !== 1){
        throw Message.SERVER_ERROR;
    }

    return result;
};

module.exports = dao_account;
