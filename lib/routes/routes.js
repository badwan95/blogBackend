'use strict';

const router = require('express').Router();

//Test route

router.get('/test',test)

function test(req,res,next){
    res.status(200).send('hello world');
}

module.exports = router;
