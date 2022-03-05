let server_type = process.env.NODE_ENV;

let domain = {
    production: "https://www.moneydiary.co.kr/",
    // production: "http://127.0.0.1:8081/",
    // development: "https://www.moneydiary.co.kr/",
    development: "http://127.0.0.1:8081/",
};

const config = {};

config.domain = domain[server_type];


export default config;