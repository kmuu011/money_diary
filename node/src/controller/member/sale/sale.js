const express = require('express');
const router = express.Router();
const member = require(`libs/member`);
const nodemailer = require(`libs/nodemailer`);
const message = require(`libs/message`);
const db = require(`libs/db`);

const service_member = require(`service/member/member`);

router.use(member.login_check());

router.use('/keyword', require('./keyword'));

router.post('/mailing_test', async (req, res, next) => {
    const member_info = req.member;

    if(member_info.mailing_test === 0) throw message.DETAIL_ERROR('1분 뒤에 테스트 메일을 다시 발송할 수 있습니다.');

    req.connector = await db.get_connection();

    await service_member.update_mailing_test_at(req);

    await db.commit(req.connector);

    let html = nodemailer.storage.sale_test;
    html = html.replace(/#NICKNAME/g, m.nickname);
    html = html.replace(/#TITLE/g, '이메일 확인용 메일');
    html = html.replace(/#CATEGORY/g, '테스트');
    html = html.replace(/#TARGET_URL/g, 'https://www.moneydiary.co.kr/member/sale');
    html = html.replace(/#PRICE_TYPE/g, '￦');
    html = html.replace(/#PRICE/g, '1,000');

    const result = await nodemailer.send(m.nickname, m.email, '[특가정보] 이메일 확인용 테스트 메일입니다.', html)

    if(result === false){
        throw message.DETAIL_ERROR('이메일이 올바르지 않습니다. 다시 확인해주세요.');
    }


    res.json(true);
});

module.exports = router;
