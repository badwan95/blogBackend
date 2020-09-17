'use strict';

const router = require('express').Router();
const user = require('../../auth/schema/userSchema'); // The users schema used for signing in and up
const basicAuthentication = require('../../auth/middleware/basicAuth');

// The Signin / Signup Routes

router.post('/signup', signup);
router.post('/signin', basicAuthentication, signin);







// The Signin / Signup Functions

function signup (req,res,next){
  user.create(req.body)
    .then(result=>{
      res.status(201).json(result);
    })
    .catch(next);
}

function signin(req,res,next){
  res.cookie('blog-token',req.token);
  let jsonResponse = {};
  jsonResponse.token = req.token;
  jsonResponse.user = {username: req.userDetails.username,userid:req.userDetails._id, role:req.userDetails.role};
  res.status(200).json(jsonResponse);
}

module.exports = router;
