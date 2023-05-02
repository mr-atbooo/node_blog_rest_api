const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema(
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
    status: {
      type: Number,
      min: 0,
      max: 1,
      default: 0 
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    // catData: {
    //   name: {
    //     type: String,
    //     required: true
    //   },
    //   catId: {
    //     type: Schema.Types.ObjectId,
    //     required: true,
    //     ref: 'Category'
    //   }
    // },
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
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
