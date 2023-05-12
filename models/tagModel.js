const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const tagSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Please provide Tag name'],
    unique: true
  },
  slug: {
    type: String,
    required: [true, 'Please provide Tag slug'],
    unique: true
  },
  content: {
    type: String,
    required: false
  }
},{ timestamps: true });

tagSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Tag', tagSchema);
