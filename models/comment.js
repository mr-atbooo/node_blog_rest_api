const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  text: {
    type: String,
    trim: true,
    required: true
  },
  status: {
    type: String, //Pending, Approved, Spam, Trash
    trim: true,
    default: 'Pending'
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
},{ timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
