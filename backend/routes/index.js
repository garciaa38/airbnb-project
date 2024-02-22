const express = require('express');
const router = express.Router();
const apiRouter = require('./api');


// router.get('/hello/world', function(req, res) {
    //     res.cookie('XSRF-TOKEN', req.csrfToken());
    //     res.send('Hello World!');
    // });


    console.log('TEST6');
router.get("/api/csrf/restore", (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN", csrfToken);
    res.status(200).json({
        'XSRF-Token': csrfToken
    });
});
console.log('TEST7');
router.use('/api', apiRouter);
console.log('TEST8');
module.exports = router;
