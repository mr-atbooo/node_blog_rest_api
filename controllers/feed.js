const fileHelper = require('../util/file');
  const { validationResult } = require('express-validator');
  const Product = require('../models/product');

exports.getPosts = (req, res, next) => {
  
  Product.find()
    .then(products => {

      res.status(200).json({
        posts: products
      });
      // console.log(products.length);
    
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
exports.createPost = (req, res, next) => {
  console.log(req);
  const title = req.body.title;
  const content = req.body.content;
  // Create post in db
  res.status(201).json({
    message: 'Post created successfully!',
    post: { id: Date.now(), title: title, content: content }
  });
};  