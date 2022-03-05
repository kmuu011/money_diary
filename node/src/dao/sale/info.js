const dao_sale_info = {};
const Message = require(`libs/message`);

const mysql = require('mysql');
const db = require(`libs/db`);

let sql;

dao_sale_info.select = async () => {
    sql = "SELECT idx, title, category, price, price_type, url, unq_key " +
        "FROM sale_info " +
        "ORDER BY created_at DESC ";

    return await db.query(sql);
};

dao_sale_info.select_one = async (unq_key) => {
    sql = "SELECT idx " +
        "FROM sale_info WHERE unq_key = ? ";
    sql = mysql.format(sql, [ unq_key ]);

    return await db.query(sql);
};

dao_sale_info.insert = async (organized_sql) => {
    let { sql_col, sql_val } = organized_sql;

    sql = "INSERT INTO sale_info (" + sql_col + ") VALUES(" + sql_val + ")";

    let insert_item = await db.query(sql);

    if(insert_item.affectedRows !== 1){
        throw Message.SERVER_ERROR;
    }

    return insert_item;
};


dao_sale_info.update = async (organized_sql, unq_key) => {
    let { sql_set } = organized_sql;

    sql = "UPDATE sale_info SET " + sql_set + " " +
        "WHERE unq_key = ?";
    sql = mysql.format(sql,  [ unq_key ]);

    let update_item = await db.query(sql);

    if(update_item.affectedRows !== 1){
        throw Message.SERVER_ERROR;
    }

    return update_item;
};

dao_sale_info.select_keyword_user = async (title) => {
    sql = "SELECT m.idx, m.nickname, m.email, GROUP_CONCAT(k.keyword) keyword " +
        "FROM sale_keyword k " +
        "LEFT JOIN member m ON m.idx = k.member_idx " +
        "WHERE ? LIKE CONCAT ('%', REPLACE(k.keyword, ' ', ''), '%') " +
        "GROUP BY m.idx ";
    sql = mysql.format(sql, [ title.replace(/\s/g, '') ]);

    return await db.query(sql);
};


module.exports = dao_sale_info;