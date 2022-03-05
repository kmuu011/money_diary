require('module-alias/register');

const SERVER_TYPE = process.env.NODE_ENV || '';

// @ts-ignore
const app = require('../app');
// @ts-ignore
const http = require('http');
// @ts-ignore
const config = require(`config`);

app.set('port', config.server.port);

(async () => {
    const server = http.createServer(app);

    server.listen(app.get('port'));

    if((/^production$|^development$/).test(SERVER_TYPE)){
        app.io.attach(server);
    }

})().catch(err => {
    throw err;
});
