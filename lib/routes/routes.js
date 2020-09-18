'use strict';

const router = require('express').Router();

// MongoDB Schema's
const user = require('../../auth/schema/userSchema'); // The users schema used for signing in and up
const blog = require('../schemas/blog-schema');
const story = require('../schemas/story-schema');
const content = require('../schemas/content-schema');

// Middleware
const basicAuthentication = require('../../auth/middleware/basicAuth');
const bearerAuthentication = require('../../auth/middleware/bearerAuth');

// The Signin / Signup Routes

router.post('/signup', signup);
router.post('/signin', basicAuthentication, signin);
router.get('/testbearer',bearerAuthentication, testbearer);
router.post('/verify',verifyToken);

// RESTful API Routes

//Blog RESTful API Routes
router.get('/blogs',getBlogs);
router.get('/blogs/:id',getOneBlog);
router.post('/blogs',bearerAuthentication, postBlogs);

//Stories RESTful API Routes
router.get('/story/:id', getStory);
router.get('/story/specific/:id', getSpecificStories);
router.post('/story',bearerAuthentication, postStory);

//Content RESTful API Routes
router.get('/content/:id', getContent);
router.post('/content',bearerAuthentication, postContent);

// Admin Routes
router.get('/story',bearerAuthentication,getAllStories);
router.put('/story/:id',bearerAuthentication,editStory);
router.delete('/story/:id',bearerAuthentication,deleteStory);



// RESTful Routes Functions

function getBlogs(req,res,next){
  blog.find({})
    .then(blogs => res.status(200).json(blogs))
    .catch(next);
}

function getOneBlog(req,res,next){
  blog.findOne({_id:req.params.id})
  .then(blog => res.status(200).json(blog))
  .catch(next);
}

function postBlogs(req,res,next){
  req.body.owner = req.user.username;
  blog.create(req.body)
    .then(result =>{
      res.status(201).json(result);
    }).catch(next);
}

function getStory(req,res,next){
  story.find({blogid:req.params.id})
    .then(stories => res.status(200).json(stories))
    .catch(next);
}

function getSpecificStories(req,res,next){
    story.findOne({_id:req.params.id})
    .then(story => res.status(200).json(story))
    .catch(next);
}

function postStory(req,res,next){
  req.body.owner = req.user.username;
  story.create(req.body)
    .then(result =>{
      res.status(201).json(result);
    }).catch(next);
}


function getContent(req,res,next){
  content.find({storyid:req.params.id})
  .then(theContent => res.status(200).json(theContent))
  .catch(next);
}

function postContent(req,res,next){
  req.body.owner = req.user.username;
  content.create(req.body)
  .then(result =>{
    res.status(201).json(result);
  }).catch(next);
}

function getAllStories(req,res,next){
  if(req.user.userRole === 'admin'){
    story.find({})
    .then(stories => res.status(200).json(stories))
    .catch(next);
  } else {
    next('Access Denied')
  }
}

function editStory(req,res,next){
  if(req.user.userRole === 'admin'){
    console.log(req.body)
    story.findByIdAndUpdate(req.params.id, req.body,{new: true})
    .then(story => res.status(200).json(story))
    .catch(next);
  } else {
    next('Access Denied')
  }
}

function deleteStory(req,res,next){
  if(req.user.userRole === 'admin'){
    story.findByIdAndDelete(req.params.id)
    .then(data => res.status(200).json(data))
    .catch(next);
  } else {
    next('Access Denied')
  }
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
      let user = decodedUser;
      res.status(201).json(decodedUser);
    }).catch(err=> next('Invalid User Token: ' + err));
}

module.exports = router;
