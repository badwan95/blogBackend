'use strict';
require('dotenv').config();
const mongoose = require('mongoose');
const server = require('./lib/server');

const URI = process.env.MONGODB_URI;
mongoose.connect(URI,{
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// You can add the port that you want as an argument for server()
server();
