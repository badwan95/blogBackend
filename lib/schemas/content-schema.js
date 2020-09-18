'use strict';

const mongoose = require('mongoose');

const content = mongoose.Schema({
  title: { type: String, required: true },
  owner: {type: String, required: true},
  storyid: {type: String, required: true},
  content: { type: String, required: true},
},{timestamps: { createdAt: 'createdat' }});

module.exports = mongoose.model('content', content);
