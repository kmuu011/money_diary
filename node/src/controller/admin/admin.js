const express = require('express');
const router = express.Router();


let apis = [

];

for(let api of apis){
    router.use('/' + api, require('./' + api + '/' + api));
}

module.exports = router;
