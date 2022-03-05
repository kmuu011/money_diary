const dao_account_history = {};
const Message = require(`libs/message`);

const mysql = require('mysql');
const db = require(`libs/db`);

let sql;


dao_account_history.select_one = async (history_idx) => {
    sql = "SELECT h.idx, (SELECT member_idx FROM account WHERE idx = h.account_idx) member_idx, " +
        "c.idx category_idx, c.name category_name, c.color category_color, h.type, h.amount, h.content " +
        "FROM account_history h, account_history_category c " +
        "WHERE h.category_idx = c.idx " +
        "AND h.idx = ? ";

    sql = mysql.format(sql, [ history_idx ]);

    return await db.query(sql);
};

dao_account_history.select = async (account_idx, page, count, type, year, month, date, category_idx) => {
    let rp = {};

    sql = "SELECT h.idx, c.idx category_idx, c.name category_name, c.color category_color, h.type, h.amount, h.content " +
        "FROM account_history h, account_history_category c " +
        "WHERE h.category_idx = c.idx " +
        "AND h.account_idx = ? ";
    sql = mysql.format(sql, [ account_idx ]);

    if(type !== undefined){
        sql += "AND h.type = ? ";
        sql = mysql.format(sql, [ type ]);
    }

    if(year !== undefined && month !== undefined && date !== undefined){
        sql += "AND FROM_UNIXTIME(h.created_at, '%Y%m%d') = ? ";
        sql = mysql.format(sql, [year + '' + month + '' + date]);
    }else if(year !== undefined && month !== undefined){
        sql += "AND FROM_UNIXTIME(h.created_at, '%Y%m') = ? ";
        sql = mysql.format(sql, [year + '' + month]);
    }else if(year !== undefined){
        sql += "AND FROM_UNIXTIME(h.created_at, '%Y') = ? ";
        sql = mysql.format(sql, [year]);
    }

    if(category_idx !== undefined){
        sql += "AND h.category_idx = ? ";
        sql = mysql.format(sql, [ category_idx ]);
    }

    sql += "ORDER BY idx DESC " +
        "LIMIT ?, ?";
    sql = mysql.format(sql, [ (page-1)*count, count ]);

    let result = await db.query(sql);

    sql = "SELECT count(*) cnt " +
        "FROM account_history " +
        "WHERE account_idx = ? ";
    sql = mysql.format(sql, [ account_idx ]);

    if(type !== undefined){
        sql += "AND type = ? ";
        sql = mysql.format(sql, [ type ]);
    }

    if(year !== undefined && month !== undefined && date !== undefined){
        sql += "AND FROM_UNIXTIME(created_at, '%Y%m%d') = ? ";
        sql = mysql.format(sql, [year + '' + month + '' + date]);
    }else if(year !== undefined && month !== undefined){
        sql += "AND FROM_UNIXTIME(created_at, '%Y%m') = ? ";
        sql = mysql.format(sql, [year + '' + month]);
    }else if(year !== undefined){
        sql += "AND FROM_UNIXTIME(created_at, '%Y') = ? ";
        sql = mysql.format(sql, [year]);
    }

    if(category_idx !== undefined){
        sql += "AND category_idx = ? ";
        sql = mysql.format(sql, [ category_idx ]);
    }

    let result_cnt = await db.query(sql);

    rp.items = result;
    rp.total_count = result_cnt[0].cnt;

    return rp;
};

dao_account_history.reset_total_amount = async (req) => {
    let account_idx = req.account_info.idx;

    sql = "UPDATE account SET total_amount = " +
        "(SELECT SUM(IF(type=1, amount, 0)) - SUM(IF(type=0, amount, 0)) total_amount " +
        "FROM account_history " +
        "WHERE account_idx = ?) " +
        "WHERE idx = ?";
    sql = mysql.format(sql, [ account_idx, account_idx ]);

    let result = await db.run(req.connector, sql);

    if (result.affectedRows !== 1){
        throw Message.SERVER_ERROR;
    }

    return result;
};

dao_account_history.select_daily_situation = async (account_idx, start, end) => {
    sql = "SELECT SUM(IF(type=0 , amount, 0)) outcome, SUM(IF(type=1 , amount, 0)) income, FROM_UNIXTIME(created_at, '%Y%m%d') day FROM account_history " +
        "WHERE account_idx = ? " +
        "AND FROM_UNIXTIME(created_at, '%Y%m%d') >= ? AND FROM_UNIXTIME(created_at, '%Y%m%d') <= ? " +
        "GROUP BY FROM_UNIXTIME(created_at, '%Y%m%d')";

    sql = mysql.format(sql, [ account_idx, start, end ]);

    return await db.query(sql);
};

dao_account_history.select_month_situation = async (account_idx, year_month) => {
    sql = "SELECT SUM(IF(type=0, amount, 0)) outcome, SUM(IF(type=1, amount, 0)) income " +
        "FROM account_history " +
        "WHERE account_idx = ? " +
        "AND FROM_UNIXTIME(created_at, '%Y%m') = ?";
    sql = mysql.format(sql, [ account_idx, year_month]);

    return await db.query(sql);
};

dao_account_history.select_category_info = async (account_idx, type, year, month) => {
    sql = "SELECT c.name, SUM(h.amount) amount, CONCAT('#',c.color) color, c.idx category_idx FROM account_history h, account_history_category c " +
        "WHERE h.account_idx = ? AND h.category_idx = c.idx AND h.type = ? ";
    sql = mysql.format(sql, [ account_idx, type ]);

    if(month === undefined){
        sql += "AND FROM_UNIXTIME(h.created_at, '%Y') = ? ";
        sql = mysql.format(sql, [ year ]);
    }else{
        sql += "AND FROM_UNIXTIME(h.created_at, '%Y%m') = ? ";
        sql = mysql.format(sql, [ year+month ]);
    }

    sql += "GROUP BY c.name, c.color, c.idx";

    return await db.query(sql);
};

dao_account_history.insert = async (req, organized_sql) => {
    let { created_at } = req.body;
    let { sql_col, sql_val } = organized_sql;

    sql = "INSERT INTO account_history (" + sql_col + " created_at, updated_at) " +
        "VALUES(" + sql_val + " ";

    if(created_at === undefined) {
        sql += "UNIX_TIMESTAMP(), UNIX_TIMESTAMP())";
    }else{
        sql += "UNIX_TIMESTAMP(?), UNIX_TIMESTAMP())";
        sql = mysql.format(sql, [ created_at ]);
    }

    let result = await db.run(req.connector, sql);

    if(result.affectedRows !== 1){
        throw Message.SERVER_ERROR;
    }

    return result;
};

dao_account_history.update = async (req, organized_sql) => {
    let history_Idx = req.history_info.idx;
    let { sql_set } = organized_sql;

    sql = "UPDATE account_history SET " + sql_set + " updated_at = UNIX_TIMESTAMP() " +
        "WHERE idx = ?";
    sql = mysql.format(sql, [ history_Idx ]);

    let result = await db.query(sql);

    if (result.affectedRows !== 1){
        throw Message.SERVER_ERROR;
    }

    return result;
};

dao_account_history.delete = async (req) => {
    sql = "DELETE FROM account_history WHERE idx = ?";
    sql = mysql.format(sql, [ req.history_info.idx ]);

    let result = await db.run(req.connector, sql);

    if (result.affectedRows !== 1){
        throw Message.SERVER_ERROR;
    }

    return result;
};

module.exports = dao_account_history;
