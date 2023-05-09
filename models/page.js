const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const pageSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    publish: {
      type: Number,
      min: 0, //now
      max: 1, //at date
      default: 0 
    },
    publishAt: {
      type: Date,
      min: '2020-01-01',
      // max: '2050-05-23',
      default: Date.now 
    },
    img: {
      type: String,
      required: true
    },
    excerpt: {
      type: String,
      required: false
    }, 
    content: {
      type: String,
      required: true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Page', pageSchema);
