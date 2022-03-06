const dao_member = {};
const message = require(`libs/message`);

const mysql = require('mysql');
const db = require(`libs/db`);

let sql;

dao_member.select_member = async (member_idx) => {
    sql = "SELECT idx, id, nickname, email, profile_img_key, " +
        "admin, auth_id, ip, user_agent, max_sale_keyword_cnt, " +
        "(mailing_test_at<UNIX_TIMESTAMP()-60) mailing_test " +
        "FROM member WHERE idx = ?";
    sql = mysql.format(sql, [ member_idx ]);

    let member_info = await db.query(sql);

    if(member_info.length === 0){
        throw message.UNAUTHORIZED;
    }

    if(member_info[0].auth_id !== null){
        member_info[0].id = 'SNS 연동 계정';
    }

    return member_info[0];
};

dao_member.login = async (id, password) => {
    sql = "SELECT idx, id, nickname, created_at*1000 created_at, " +
        "auth_id " +
        "FROM member WHERE id = ? AND password = ? ";
    sql = mysql.format(sql, [ id, password ]);

    let member_check = await db.query(sql);

    if(member_check.length === 0){
        throw message.WRONG_ID_OR_PASSWORD;
    }

    if(member_check[0].auth_id !== null){
        throw message.CONNECTED_SNS;
    }

    return member_check[0];
};

dao_member.sign_up = async (req) => {
    let { sql_col, sql_val } = req.organized_sql;

    sql = "INSERT INTO member (" + sql_col + " created_at, updated_at) " +
        "VALUES (" + sql_val + " UNIX_TIMESTAMP(), UNIX_TIMESTAMP())";

    let sign_up = await db.run(req.connector, sql);

    if(sign_up.affectedRows !== 1){
        throw message.SERVER_ERROR;
    }

    return sign_up;
};

dao_member.update_member = async (req, member_idx) => {
    let { sql_set } = req.organized_sql;

    member_idx = member_idx === undefined ? req?.member?.idx : member_idx;

    if(member_idx === undefined) throw message.DETAIL_ERROR('member_idx가 유효하지않습니다.');

    sql = "UPDATE member " +
        "SET " + sql_set + " updated_at = UNIX_TIMESTAMP() " +
        "WHERE idx = ?";
    sql = mysql.format(sql, [ member_idx ]);

    let update_member = await db.run(req.connector, sql);

    if(update_member.affectedRows !== 1){
        throw message.SERVER_ERROR;
    }

    return update_member;
};

dao_member.update_mailing_test_at = async (req) => {
    sql = "UPDATE member " +
        "SET mailing_test_at = UNIX_TIMESTAMP() " +
        "WHERE idx = ? ";
    sql = mysql.format(sql, [ req.member.idx ]);

    let update_member = await db.run(req.connector, sql);

    if(update_member.affectedRows !== 1){
        throw message.SERVER_ERROR;
    }

    return update_member;
};

dao_member.update_profile_img = async (req, key) => {
    sql = "UPDATE member " +
        "SET profile_img_key = ? " +
        "WHERE idx = ?";
    sql = mysql.format(sql, [ key, req.member.idx ]);

    let update_profile_img = await db.run(req.connector, sql);

    if(update_profile_img.affectedRows !== 1){
        throw message.SERVER_ERROR;
    }

    return update_profile_img;
};

dao_member.profile_img_check = async (profile_img_key) => {
    sql = "SELECT idx FROM member WHERE profile_img_key = ?";
    sql = mysql.format(sql, [ profile_img_key ]);

    let result = await db.query(sql);

    return result.length === 0;
};


dao_member.id_dup_check = async (id) => {
    sql = "SELECT idx FROM member WHERE id = ?";
    sql = mysql.format(sql, [ id ]);

    let id_check = await db.query(sql);

    if(id_check.length > 0){
        throw message.ALREADY_EXIST('아이디');
    }

    return id_check;
};


dao_member.email_dup_check = async (email) => {
    sql = "SELECT idx FROM member WHERE email = ?";
    sql = mysql.format(sql, [ email ]);

    let email_check = await db.query(sql);

    if(email_check.length > 0){
        throw message.ALREADY_EXIST('이메일');
    }

    return email_check;
};

dao_member.nick_dup_check = async (nickname) => {
    sql = "SELECT idx FROM member WHERE nickname = ?";
    sql = mysql.format(sql, [ nickname ]);

    let nick_check = await db.query(sql);

    if(nick_check.length > 0){
        throw message.ALREADY_EXIST('닉네임');
    }

    return nick_check;
};

dao_member.old_pwd_check = async (member_idx, old_password) => {
    sql = "SELECT idx FROM member " +
        "WHERE idx = ? AND password = ?";
    sql = mysql.format(sql, [ member_idx, old_password ]);

    let pwd_check = await db.query(sql);

    if(pwd_check.length !== 1){
        throw message.WRONG_PARAM('이전 비밀번호');
    }

    return true;
};





module.exports = dao_member;
