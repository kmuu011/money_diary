require('module-alias/register');

// @ts-ignore
const app = require('./app');
// @ts-ignore
const http = require('http');

app.set('port', 8888);

let server;
(async () => {
    try {
        server = http.createServer(app);

        server.listen(app.get('port'));

    } catch (e) {
        throw e;
    } finally {
        server.close();
    }
})();

