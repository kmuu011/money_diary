const member = {};

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const message = require(`libs/message`);

const cipher = require(`libs/cipher`);

const dao_member = require(`dao/member/member`);

const config = require(`config`);

const salt = config.member.salt;

const jwt_secret = config.member.jwt_secret;
const expire_time = config.member.expire_time;

const login_check = async (req, res) => {
    const token = req.headers['x-token'];
    let check;

    if(token === undefined || token === null || token === 'undefined' || token === 'null'){
        throw message.UNAUTHORIZED
    }

    check = await member.decode_token(token);

    if(check == null){
        throw message.UNAUTHORIZED;
    }

    req.member = await dao_member.select_member(check.idx);

    if((req.member.ip !== check.ip) || (req.member.user_agent !== check.user_agent)){
        throw message.UNAUTHORIZED;
    }

    if(check.keep_check === true){
        const now = Date.now()/1000;
        const time = check.time/1000;

        req.member.keep_check = true;

        if(now - time > (60*60*24)) {
            let new_token = await member.token(req.member);
            res.header('x-new-token', new_token);
        }
    }
};

member.auth_type = {
    'default' : 0,
    'kakao' : 1
};

member.encrypt = async (password) => {
    return crypto.createHash(config.member.hash_algorithm).update(password+salt).digest('hex');
};

member.token = async (member) => {
    const time = Date.now();
    const { idx, id, nickname, created_at, ip, user_agent } = member;
    let { keep_check } = member;

    if(keep_check === 'true') keep_check = true;

    const token = jwt.sign({ id, idx, nickname, created_at, time, keep_check, ip, user_agent }, jwt_secret, { expiresIn : expire_time });

    return await cipher.encrypt(token);
};

member.decode_token = async (token) => new Promise(async (resolve) => {
    try{
        token = await cipher.decrypt(token);
    }catch (e) {
        console.log(e);
        resolve(null);
    }

    jwt.verify(token, jwt_secret, (err, decoded) => {
        if(err){
            resolve(null);
        }
        resolve(decoded);
    });
});

member.login_check = () => async (req, res, next) => {
    await login_check(req, res);

    if(next) next();
};

member.admin_check = () => async (req, res, next) => {
    await login_check(req);

    if(req.member[0].admin !== 1){
        throw message.FORBIDDEN;
    }

    if(next) next();
};

member.login_checker = async (req, res, next) => {
    await login_check(req, res);
};




module.exports = member;
