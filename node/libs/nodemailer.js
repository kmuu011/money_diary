const nodemailer = {};
const mailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const config = require(`config`);

const transporter = mailer.createTransport({
    host: config.nodemailer.host,
    port: config.nodemailer.port,
    secure: false,
    tls: {
        rejectUnauthorized: false
    }
});

const mail_from = '미누의 가계부 <no-reply@moneydiary.co.kr>';
const logo_path = 'https://www.moneydiary.co.kr/imgs/main/mini_logo.png';
const home_url = 'https://www.moneydiary.co.kr/';

let base_html;

fs.readFile(path.resolve('libs/html/mailing.html'), 'utf8', function(err, html) {
    html = html.replace(/#LOGO_URL/g, logo_path);
    base_html = html;
});

nodemailer.send = async (name, email, subject, html, files) => {
    if(email === undefined || email === null) return;
    const attachments = [];

    html = base_html.replace(/#HTML/g, html);
    html = html.replace(/#HOME_URL/g, home_url);

    if(files !== undefined){
        for(let f of files){
            attachments.push({
                filename: f.file_name + '.' + f.file_type,
                content: f.file_buffer
            });
        }
    }

    try {
        await transporter.sendMail({
            from: mail_from,
            to: `${name} <${email}>`,
            subject: subject,
            html: html,
            attachments
        });
    } catch (e) {
        console.log(e);

        return false;
    }

    return true;
};

nodemailer.storage = require(`libs/storage/mailing`);


module.exports = nodemailer;