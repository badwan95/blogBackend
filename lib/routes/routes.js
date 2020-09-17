'use strict';

const router = require('express').Router();

// MongoDB Schema's
const user = require('../../auth/schema/userSchema'); // The users schema used for signing in and up
const blog = require('../schemas/blog-schema');

// Middleware
const basicAuthentication = require('../../auth/middleware/basicAuth');
const bearerAuthentication = require('../../auth/middleware/bearerAuth');

// The Signin / Signup Routes

router.post('/signup', signup);
router.post('/signin', basicAuthentication, signin);
router.get('/testbearer',bearerAuthentication, testbearer);
router.post('/verify',verifyToken)

// RESTful API Routes

router.get('/blogs',getBlogs)
router.post('/blogs',bearerAuthentication, postBlogs)



// RESTful Routes Functions

function getBlogs(req,res,next){
  blog.find({})
    .then(blogs => res.status(200).json(blogs))
    .catch(next);
}

function postBlogs(req,res,next){
  req.body.owner = req.user.username
  blog.create(req.body)
    .then(result =>{
      res.status(201).json(result);
    }).catch(next);
}






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
  jsonResponse = {username: req.userDetails.username,userid:req.userDetails._id, role:req.userDetails.role, token: req.token};
  res.status(200).json(jsonResponse);
}

function testbearer(req,res,next){
  res.status(201).json({valid:true});
}

function verifyToken(req,res,next){
  if(!req.headers.authorization){
    next('User not logged in');
    return;
  }
  let bearerToken = req.headers.authorization.split(' ').pop();
  user.verifyToken(bearerToken)
    .then(decodedUser =>{
      req.user = decodedUser;
      res.status(201).json({valid:true});
    }).catch(err=> next('Invalid User Token: ' + err));
}

module.exports = router;
