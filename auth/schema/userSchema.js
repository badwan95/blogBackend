'use strict';


const bcrypt =  require('bcrypt'); // For Hashing the password before saving it to the DB
const jwt = require('jsonwebtoken'); // For authentication & authorization
const mongoose = require('mongoose');
const TOKEN_TIMEOUT = process.env.TOKEN_TIMEOUT || '7d'; // To set a timeout period which after it's done the token is expired.
const SECRET = process.env.SECRET; // The secret for the hashing

const users = mongoose.Schema({
  username: { type : String , unique : true, required : true},
  password:{type:String,required:true},
  role:{type:String, enum:['admin','writer'], default:'writer'},
});

users.pre('save',async function(){
  this.password = await bcrypt.hash(this.password,5);
});

