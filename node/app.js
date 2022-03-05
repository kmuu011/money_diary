'use strict';

const createError = require('http-errors');
const express = require('express');
require('express-async-errors');
require('./global/index');

const helmet = require('helmet');
const fs = require('fs');

const path = require('path');
const cookieParser = require('cookie-parser');
const api_logger = require('morgan'); //API 호출 로깅
const utils = require(`libs/utils`);

const member = require(`libs/member`);
const redis_socket = require('socket.io-redis');
const config = require(`config`);
const dao_init = require(`dao/init/init`);

const service_log = require(`service/log/log`);

global.BASE_PATH = __dirname + '/files/';

const app = express();

const options = {etag: false};
app.set("etag", false);

app.use(helmet());
app.use(helmet.contentSecurityPolicy());
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());

app.use(async (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'DELETE, GET, POST, PATCH');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, x-token, Content-Type');
    res.header('Content-Security-Policy', '');

    next();
});

const title = '미누의 가계부';
const description = '소비 패턴을 분석하기 위해 만든 서비스입니다.';

const show_html = async (req, res) => {
    return await new Promise(async (resolve) => {
        fs.readFile(path.resolve(__dirname, 'public/index.html'), 'utf8', function (err, html) {
            html = html.replace(/\$OG_TITLE/g, title);
            html = html.replace(/\$OG_DESCRIPTION/g, description);
            html = html.replace(/\$OG_IMAGE/g, '/imgs/main/logo.png');

            html = html.replace(/\$SITE_TITLE/g, title);
            html = html.replace(/\$SITE_DESCRIPTION/g, description);

            resolve(html);
        });
    });
};

app.get('/', async (req, res) => {
    const html = await show_html(req, res);

    res.send(html);
});

app.set('views', path.join(__dirname, '/views/container'));
app.set('view engine', 'ejs');
app.use('/view', require(__dirname + '/views/router/index'));
app.use(express.static(path.join(__dirname, 'node_modules')));

app.use(api_logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use(express.static("./public", options));
app.use(express.static("./files", options));

app.use(async (req, res, next) => {
    try{
        await member.login_checker(req, res, next);
    }catch (e) {}

    await service_log.insert_visit(req);

    next();
});

app.use('/api', require('./src/controller/index'));

app.get(['/', '/*'], async (req, res) => {
    const html = await show_html(req, res);

    res.send(html);
});

if ((/^production$|^development$/).test(SERVER_TYPE)) {
    (async () => {
        await utils.sleep(1);
        await dao_init.init_system_time();
    })();

    app.io = require('socket.io')();

    const io = app.io;

    io.adapter(redis_socket({
        host: config.redis.host,
        port: 6379
    }));

    const socket_module = require('./socket/socket');

    io.on('connection', async (socket) => {
        await socket_module.bot(socket, io);
    });
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});


module.exports = app;
