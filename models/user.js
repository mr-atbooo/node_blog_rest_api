const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  fristName: {
    type: String,
    required: false
  },
  lastName: {
    type: String,
    required: false
  },
  website: {
    type: String,
    required: false
  },
  role: {
    type: String,
    default: 'user'
  },
  status: {
    type: String,
    default: 'new'
  },
  avatar: {
    type: String,
    required: false
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post'
    }
  ]
});
userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', userSchema);
