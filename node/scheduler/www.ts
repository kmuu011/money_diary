require('module-alias/register');

// @ts-ignore
const app = require('./scheduler.js');
// @ts-ignore
const http = require('http');
// @ts-ignore
const config = require(`config`);

app.set('port', config.server.port);

(async () => {
    const server = http.createServer(app);

    server.listen(app.get('port'));
})().catch(err => {
    throw err;
});
