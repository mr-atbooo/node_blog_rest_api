const { validationResult } = require('express-validator');
const Post = require('../models/post');
const Category = require('../models/category');
const User = require('../models/user');

const fileHelper = require('../util/file');

exports.getPosts = (req, res, next) => {
  const currentPage = +req.query.page || 1;
  const perPage = +req.query.size || 2;
  let totalItems;
  Post.find()
    .countDocuments()
    .then(count => {
      totalItems = count;
      return Post.find()
        .populate('categoryId','title')
        .populate('tags','title')
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then(posts => {
      res.status(200).json({
        message: 'Fetched posts successfully.',
        posts: posts,
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
    )
    .catch(err => { 
      console.log(1111111111111111111111); 
      console.log(err); 
      res.status(500).json({
        error: err
      });
    });


};

exports.storePost =(req, res, next) => {
  const title = req.body.title;
  const publish = req.body.publish;
  // const publishAt = req.body.publishAt;
  const publishAt = new Date('2021-10-26');
  const status = req.body.status;
  const category = req.body.category;
  const excerpt = req.body.excerpt;
  const content = req.body.content;
  const tags = req.body.tag;
  let creator;

  const img = req.file;
  console.log(img);
  if (!img) {
    return res.status(422).json({
      validationErrors: [
          {
              type: "field",
              msg: "Attached file is not an image.",
              path: "image",
              location: "body"
          }
      ]
    });
  }
  const imgName = img.filename;

  const errors = validationResult(req);

if (!errors.isEmpty()) {
  console.log(3);
  console.log(errors.array());
  return res.status(422).json({
    validationErrors: errors.array()
  });
  // const error = new Error("validation vailed ,enter correct data");
  //   error.httpStatusCode = 422;
  //   throw error;
    // return next(error);
 
}




  const post = new Post({
    creator: req.userId,
     title :title,
     publish :publish,
     publishAt :publishAt,
     status :status,
    //  category :category,
     img :imgName,
     excerpt :excerpt,
     content:content,
     tags:tags,
    ...(category != "") && {categoryId: category},
  });
  
  post.save()
  .then(result => {
    return User.findById(req.userId);
  })
  .then(user => {
    creator = user;
    user.posts.push(post);
    return user.save();
  })
  .then(result => {
    res.status(201).json({
      message: 'Post created successfully!',
      post: post,
      creator: { _id: creator._id, name: creator.name }
    });
  })
  .catch(err => {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });    
};

exports.updatePost =(req, res, next) => {
  const id = req.body.id;
  const title = req.body.title;
  const publish = req.body.publish;
  // const publishAt = req.body.publishAt;
  const publishAt = new Date('2021-10-26');
  const status = req.body.status;
  const category = req.body.category;
  const excerpt = req.body.excerpt;
  const content = req.body.content;

  const img = req.file;
  // console.log(img);
  // if (!img) {
  //   return res.status(422).json({
  //     validationErrors: [
  //         {
  //             type: "field",
  //             msg: "Attached file is not an image.",
  //             path: "image",
  //             location: "body"
  //         }
  //     ]
  //   });
  // }
  // const imgName = img.filename;

  const errors = validationResult(req);
  // console.log(2);

if (!errors.isEmpty()) {
  console.log(3);
  console.log(errors.array());
  return res.status(422).json({
    validationErrors: errors.array()
  });
}

  Post.findById(id)
    .then(post=>{
      post.title = title;
      post.publish = publish;
      post.publishAt = publishAt;
      post.status = status;
      // product.img :imgName,
      post.excerpt = excerpt;
      post.content = content;
    //  ...(category != "") && {categoryId: category},
      
      if (category) 
      {
        post.categoryId = category;
      }
      if (img) {
        console.log('*********');
        fileHelper.deleteFile('images/'+post.img);
        post.img = img.filename;
      }
      return post.save()
    })
  .then(result => { 
    console.log(result);
    res.status(200).json({
      message: 'Post updated successfully!',
      post: result
    });
  })
  .catch(err => {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });    
};

exports.viewPost =(req, res, next) => {
  const catId = req.params.postId;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(3);
    console.log(errors.array());
    return res.status(422).json({
      validationErrors: errors.array()
    });
  }

  Post.findById(catId)
  .populate('categoryId','title')
    .then(post=>{
      // return Category.findById(post.categoryId)
      // .then(category=>{
        res.status(200).json({
          post: post,
          // category:category
        });
      // })
      // .catch(err => {
      //   console.log(err);
      //   const error = new Error(err);
      //   error.httpStatusCode = 500;
      //   return next(error);
      // }); 
      
      
    })
 
  .catch(err => {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });    
};

exports.deletePosts =(req, res, next) => {
  const postIds = req.body.ids;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(3);
    console.log(errors.array());
    return res.status(422).json({
      validationErrors: errors.array()
    });
  }

  Post.find({'_id':{'$in':postIds}})
  .select('title img ')
    .then(posts=>{
      posts.forEach(element => {
        fileHelper.deleteFile('images/'+element.img);
      });

      Post.deleteMany({'_id':{'$in':postIds}})
      .then(category=>{
        res.status(200).json({
          message: "Posts deleted successffly"
        });
      })
      
      // res.status(200).json({
      //   message: "Posts deleted successffly",
      //   posts:posts
      // });
    })
 
  .catch(err => {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });    
};

