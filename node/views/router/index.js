const express = require('express');
const router = express.Router();

const apis = [
    'test'
];

for(const api of apis){
    router.use('/' + api, require('./' + api + '/index'));
}


module.exports = router;
