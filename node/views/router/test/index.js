const express = require('express');
const router = express.Router();

const serverType = process.env.NODE_ENV;

router.use(async (req, res, next) => {
    res.locals.serverType = serverType;
    next();
});

router.get('/chat', async(req, res, next) => {
    res.render('test/chat.ejs', { title: 'Express' });

});
module.exports = router;
