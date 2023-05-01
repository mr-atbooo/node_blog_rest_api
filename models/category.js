const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  parent_id: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: false
  },
  // parentCat: {
  //   name: {
  //     type: String,
  //     required: true
  //   },
  //   userId: {
  //     type: Schema.Types.ObjectId,
  //     required: true,
  //     ref: 'User'
  //   }
  // },
  content: {
    type: String,
    required: false
  }
});

categorySchema.plugin(uniqueValidator);
module.exports = mongoose.model('Category', categorySchema);
