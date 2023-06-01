const User = require('../models/userModel');
const Tag = require('../models/tagModel');

const validator = require('validator');


module.exports = {
  hello: () => {
    return "Hello world!"
  },
  createTag: async function({ tagInput }, req) {
    console.log('111');

    const errors = [];
  
    if (
      validator.isEmpty(tagInput.title) ||
      !validator.isLength(tagInput.title, { min: 5 })
    ) {
      errors.push({ message: 'title is required!' });
    }

    if (validator.isEmpty(tagInput.slug) ) {
      errors.push({ message: 'slug is required!' });
    }
    
    if (validator.isEmpty(tagInput.content) ) {
      errors.push({ message: 'content is required!' });
    }
    
    if (errors.length > 0) {
      const error = new Error('Invalid input.');
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const tag = new Tag({
      title: tagInput.title,
      slug: tagInput.slug,
      content: tagInput.content
    });
    const createdTag = await tag.save();
    return {
      ...createdTag._doc,
      _id: createdTag._id.toString(),
      createdAt: createdTag.createdAt.toISOString(),
      updatedAt: createdTag.updatedAt.toISOString()
    };
  },
  tags: async function({ page }, req) {
    // if (!page) {
    //   page = 1;
    // }
    // const perPage = 2;
    const totalTags = await Tag.find().countDocuments();
    const tags = await Tag.find()
      .sort({ createdAt: -1 });
      // .skip((page - 1) * perPage)
      // .limit(perPage);
    return {
      tags: tags.map(p => {
        return {
          ...p._doc,
          _id: p._id.toString(),
          createdAt: p.createdAt.toISOString(),
          updatedAt: p.updatedAt.toISOString()
        };
      }),
      totalTags: totalTags
    };
  },
  tag: async function({ id }, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Not authenticated!');
    //   error.code = 401;
    //   throw error;
    // }
    const tag = await Tag.findById(id);
    if (!tag) {
      const error = new Error('No tag found!');
      error.code = 404;
      throw error;
    }
    return {
      ...tag._doc,
      _id: tag._id.toString(),
      createdAt: tag.createdAt.toISOString(),
      updatedAt: tag.updatedAt.toISOString()
    };
  },
  updateTag: async function({ id, tagInput }, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Not authenticated!');
    //   error.code = 401;
    //   throw error;
    // }
    const tag = await Tag.findById(id);
    if (!tag) {
      const error = new Error('No tag found!');
      error.code = 404;
      throw error;
    }
    // if (post.creator._id.toString() !== req.userId.toString()) {
    //   const error = new Error('Not authorized!');
    //   error.code = 403;
    //   throw error;
    // }
    // const errors = [];
    // if (
    //   validator.isEmpty(postInput.title) ||
    //   !validator.isLength(postInput.title, { min: 5 })
    // ) {
    //   errors.push({ message: 'Title is invalid.' });
    // }
    // if (
    //   validator.isEmpty(postInput.content) ||
    //   !validator.isLength(postInput.content, { min: 5 })
    // ) {
    //   errors.push({ message: 'Content is invalid.' });
    // }
    // if (errors.length > 0) {
    //   const error = new Error('Invalid input.');
    //   error.data = errors;
    //   error.code = 422;
    //   throw error;
    // }
    tag.title = tagInput.title;
    tag.content = tagInput.content;
    tag.slug = tagInput.slug;
    // if (postInput.imageUrl !== 'undefined') {
    //   post.imageUrl = postInput.imageUrl;
    // }
    const updatedTag = await tag.save();
    return {
      ...updatedTag._doc,
      _id: updatedTag._id.toString(),
      createdAt: updatedTag.createdAt.toISOString(),
      updatedAt: updatedTag.updatedAt.toISOString()
    };
  },
  deleteTag: async function({ id }, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Not authenticated!');
    //   error.code = 401;
    //   throw error;
    // }
    const tag = await Tag.findById(id);
    if (!tag) {
      const error = new Error('No tag found!');
      error.code = 404;
      throw error;
    }
    // if (post.creator.toString() !== req.userId.toString()) {
    //   const error = new Error('Not authorized!');
    //   error.code = 403;
    //   throw error;
    // }
    // clearImage(post.imageUrl);
    await Tag.findByIdAndRemove(id);
    // const user = await User.findById(req.userId);
    // user.posts.pull(id);
    // await user.save();
    return true;
  }
};
