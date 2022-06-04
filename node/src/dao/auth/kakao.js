const dao_auth_kakao = {};
const message = require(`libs/message`);

const mysql = require('mysql');
const db = require(`libs/db`);

const member = require(`libs/member`);

dao_auth_kakao.exist_check = async (auth_id) => {
    let sql = "SELECT idx, 'SNS 연동 계정' id, nickname, created_at*1000 created_at " +
        "FROM member WHERE auth_id = ?";
    sql = mysql.format(sql, [ auth_id ]);

    return await db.query(sql);
};

dao_auth_kakao.sign_up = async (req, organized_sql) => {
    const { sql_col, sql_val } = organized_sql;

    let sql = "INSERT INTO member " +
        "(" + sql_col + " created_at, updated_at) " +
        "VALUES(" + sql_val + " UNIX_TIMESTAMP(), UNIX_TIMESTAMP())";

    const sign_up_result = await db.run(req.connector, sql);

    if(sign_up_result.affectedRows !== 1){
        throw message.SERVER_ERROR;
    }

    return sign_up_result;
};

dao_auth_kakao.member_link = async (connector, member_info, auth_id) => {
    let sql = "UPDATE member SET auth_type = ?, auth_id = ? " +
        "WHERE idx = ? ";
    sql = mysql.format(sql, [ member.auth_type.kakao, auth_id, member_info.idx ]);

    return await db.run(connector, sql);
};


module.exports = dao_auth_kakao;
