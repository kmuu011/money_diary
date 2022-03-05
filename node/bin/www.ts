require('module-alias/register');

// @ts-ignore
const app = require('../app');
// @ts-ignore
const http = require('http');
const config = require(`config`);

app.set('port', config.server.port);

(async () => {
    const server = http.createServer(app);

    server.listen(app.get('port'));

    app.io.attach(server);
})().catch(err => {
    throw err;
});
