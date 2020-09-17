'use strict';

const router = require('express').Router();
const user = require('../../auth/schema/userSchema'); // The users schema used for signing in and up

// The Signin / Signup Routes

router.post('/signup', signup)







// The Signup Functions

function signup (req,res,next){
  user.create(req.body)
    .then(result=>{
      res.status(201).json(result);
    })
    .catch(next);
}

module.exports = router;
