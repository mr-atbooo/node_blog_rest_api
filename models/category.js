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
  parentId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: false
  },
  content: {
    type: String,
    required: false
  }
},{ timestamps: true });

categorySchema.plugin(uniqueValidator);
module.exports = mongoose.model('Category', categorySchema);
