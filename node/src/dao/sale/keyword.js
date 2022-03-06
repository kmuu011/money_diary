const dao_sale_keyword = {};
const message = require(`libs/message`);

const mysql = require('mysql');
const db = require(`libs/db`);

let sql;

dao_sale_keyword.select = async (req) => {
    sql = "SELECT idx, keyword " +
        "FROM sale_keyword WHERE member_idx = ? " +
        "ORDER BY created_at DESC";
    sql = mysql.format(sql, [ req.member.idx ]);

    return await db.query(sql);
};

dao_sale_keyword.select_one = async (req, keyword_idx) => {
    sql = "SELECT idx " +
        "FROM sale_keyword WHERE idx = ? AND member_idx = ? ";
    sql = mysql.format(sql, [ keyword_idx, req.member.idx ]);

    return await db.query(sql);
};

dao_sale_keyword.dup_check = async (req, keyword) => {
    sql = "SELECT idx FROM sale_keyword WHERE member_idx = ? AND keyword = ? ";
    sql = mysql.format(sql, [ req.member.idx, keyword ]);

    return await db.query(sql);
};

dao_sale_keyword.insert = async (req) => {
    let { sql_col, sql_val } = req.organized_sql;

    sql = "INSERT INTO sale_keyword (" + sql_col + ") VALUES(" + sql_val + ")";

    let insert_item = await db.run(req.connector, sql);

    if(insert_item.affectedRows !== 1){
        throw message.SERVER_ERROR;
    }

    return insert_item;
};

dao_sale_keyword.delete = async (req, keyword_idx) => {
    sql = "DELETE FROM sale_keyword " +
        "WHERE member_idx = ? AND idx = ?";
    sql = mysql.format(sql, [ req.member.idx, keyword_idx ]);

    let delete_item = await db.run(req.connector, sql);

    if(delete_item.affectedRows !== 1){
        throw message.SERVER_ERROR;
    }

    return delete_item;
};



module.exports = dao_sale_keyword;
