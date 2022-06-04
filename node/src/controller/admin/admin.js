const express = require('express');
const router = express.Router();

const apis = [];

for(const api of apis){
    router.use('/' + api, require('./' + api + '/' + api));
}

module.exports = router;
