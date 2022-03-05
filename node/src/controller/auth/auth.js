const express = require('express');
const router = express.Router();


let apis = [
    'kakao'
];

for(let api of apis){
    router.use('/' + api, require('./' + api));
}

module.exports = router;
