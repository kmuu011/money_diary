const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file');
const log_dir = __dirname + '/logs';

const { combine, timestamp, printf } = winston.format;

const logFormat = printf(info => {
    if(info.message === undefined){
        return `${info.timestamp} ${info.level}: none`;
    }

    if(info.message.constructor === Object || info.message.constructor === Array){
        info.message = JSON.stringify(info.message);
    }

    return `${info.timestamp} ${info.level}: ${info.message}`;
});

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const logger = winston.createLogger({
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        logFormat,
    ),
    transports: [
        // info 레벨 로그를 저장할 파일 설정
        new winstonDaily({
            level: 'debug',
            datePattern: 'YYYY-MM-DD',
            dirname: log_dir,
            filename: `%DATE%.log`,
            maxFiles: 90,  // 30일치 로그 파일 저장
            zippedArchive: false,
        }),

        // debug 레벨 로그를 저장할 파일 설정
        new winstonDaily({
            level: 'http',
            datePattern: 'YYYY-MM-DD',
            dirname: log_dir + '/http',
            filename: `%DATE%.http.log`,
            maxFiles: 90,
            zippedArchive: false,
        }),
    ],
});




module.exports = logger;
