const { validationResult } = require('express-validator');
const Comment = require('../models/comment');
const Post = require('../models/post');

exports.getComments = async (req, res, next) => {
  const currentPage = +req.query.page || 1;
  const perPage = +req.query.size || 2;
  
  try
  {
    const totalItems = await Comment.find().countDocuments();
    const comments = await Comment.find().populate('post','title')
    .populate('creator','name').skip((currentPage - 1) * perPage).limit(perPage);
        // const query =  await Comment.find().populate('post','title');
      // const comments =  await Comment.find()
      // .populate('post','title')
      // .populate('creator','name')
      // .skip((currentPage - 1) * perPage)
      //   .limit(perPage);
      // const comments = 

      // res.status(200).json({
      //   comments: comments
      // });

      res.status(200).json({
        message: 'Fetched comments successfully.',
        comments: comments,
        pagination:{
          totalItems: totalItems,
          itemPerPage:perPage,
          currentPage: currentPage,
          hasNextPage: perPage * currentPage < totalItems,
          hasPreviousPage: currentPage > 1,
          nextPage: currentPage + 1,
          previousPage: currentPage - 1,
          lastPage: Math.ceil(totalItems / perPage)
        }
        
      });

  }
  catch(err)
  { 
    console.log(err); 
    res.status(500).json({
      error: err
    });
  };
};

exports.storeComment = async (req, res, next) => {
  const text = req.body.text;
  const postId = req.body.post;
  const creator = req.userId;
  const errors = validationResult(req);
  

if (!errors.isEmpty()) {
  console.log(errors.array());
  return res.status(422).json({
    validationErrors: errors.array()
  });
}

  try
  {
    const newComment = new Comment({
      text:text,post:postId,
      creator:creator,
    });
    
    let comment = await newComment.save();
    let post = await Post.findById(postId);
    post.comments.push(comment);
    await post.save();
      res.status(201).json({
        message: 'Comment created successfully!',
        Comment: comment
      });
    

  }
  catch(err) {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  };    
};

exports.updateComment = async (req, res, next) => {
  const text = req.body.text;
  const status = req.body.status;
  const id = req.body.id;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).json({
      validationErrors: errors.array()
    });
  }

  try
  {
    const comment = await Comment.findById(id);
    comment.text=text;
      if (status != "") {
        comment.status =status;
      }
    const updateComment = await comment.save();
      
    res.status(201).json({
      message: 'Comment Updated successfully!',
      comment: updateComment
    });

  }
  catch(err) {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  };    
};

exports.viewComment =async (req, res, next) => {
  const commentId = req.query.id;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).json({
      validationErrors: errors.array()
    });
  }

  try
  {
    const getCommentData = await Comment.findById(commentId)
    .select('-createdAt -updatedAt -__v').populate('post','title')
    .populate('creator','name');

    res.status(201).json({
      message: 'Fetched Comment info successfully.',
      comment: getCommentData
    });

  }
  catch(err) {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  };    
};

exports.deleteComments = async (req, res, next) => {
  const commentIds = req.body.ids;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).json({
      validationErrors: errors.array()
    });
  }

  try
  {
    const comments = await Comment.deleteMany({'_id':{'$in':commentIds}});
    res.status(200).json({
      message: "Comments deleted successffly"
    });
  }
  catch(err){
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  };    
};

