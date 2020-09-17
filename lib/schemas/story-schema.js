'use strict';

const mongoose = require('mongoose');

const story = mongoose.Schema({
  title: { type: String, required: true },
  owner: {type: String, required: true},
  blogid: {type: String, required: true},
  content: {type: String, required: true}
},{timestamps: { createdAt: 'createdat' }});

module.exports = mongoose.model('story', story);
