const express = require('express');
const router = express.Router();

const apis = [
    'kakao'
];

for(const api of apis){
    router.use('/' + api, require('./' + api));
}

module.exports = router;
