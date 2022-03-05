let express = require('express');
let router = express.Router();


let apis = [
    'test'
];

for(let api of apis){
    router.use('/' + api, require('./' + api + '/index'));
}


module.exports = router;
