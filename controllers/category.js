const { validationResult } = require('express-validator');
const Category = require('../models/category');

exports.getCategories = (req, res, next) => {
  
  Category.find()
    .then(categories => {
      res.status(200).json({
        categories: categories
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

exports.storeCategory =(req, res, next) => {
  const title = req.body.title;
  const slug = req.body.slug;
  const parentId = req.body.parent_id;
  const content = req.body.content;

  const errors = validationResult(req);
  // console.log(2);

if (!errors.isEmpty()) {
  console.log(3);
  console.log(errors.array());
  return res.status(422).json({
    validationErrors: errors.array()
  });
  // return res.status(422).render('admin/add-product', {
  //   pageTitle:'Add Products',
  //   path:"/admin/add-product",
  //   editing: false,
  //   hasError: true,
  //   product: {
  //     title: p_title,
  //     price: p_price,
  //     description: p_description
  //   },
  //   errorMessage: errors.array()[0].msg,
  //   validationErrors: errors.array()
  // });
}



  const category = new Category({
    title:title,
    slug:slug,
    // parent_id:parentId,
    ...(parentId != "") && {parent_id: parentId},
    content:content,
  });
  
  category.save()
  .then(result => { 
    console.log(result);
    res.status(200).json({
      message: 'done'
    });
  })
  .catch(err => {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });    
};

exports.updateCategory =(req, res, next) => {
  const title = req.body.title;
  const slug = req.body.slug;
  const parentId = req.body.parent_id;
  const content = req.body.content;
  const id = req.body.id;

  const errors = validationResult(req);
  // console.log(2);

if (!errors.isEmpty()) {
  console.log(3);
  console.log(errors.array());
  return res.status(422).json({
    validationErrors: errors.array()
  });
}

  Category.findById(id)
    .then(category=>{
      
      category.title=title;
      category.slug=slug;
      category.content=content;
      if (parentId != "") {
      category.parent_id =parentId;
      }
      return category.save()
    })
  .then(result => { 
    console.log(result);
    res.status(200).json({
      message: 'done'
    });
  })
  .catch(err => {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });    
};

exports.viewCategory =(req, res, next) => {
  const catId = req.query.id;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(3);
    console.log(errors.array());
    return res.status(422).json({
      validationErrors: errors.array()
    });
  }

  Category.findById(catId)
    .then(category=>{
      
      res.status(200).json({
        category: category
      });
    })
 
  .catch(err => {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });    
};

exports.deleteCategories =(req, res, next) => {
  const catIds = req.body.ids;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(3);
    console.log(errors.array());
    return res.status(422).json({
      validationErrors: errors.array()
    });
  }

  Category.deleteMany({'_id':{'$in':catIds}})
    .then(category=>{
      res.status(200).json({
        message: "Categories deleted successffly"
      });
    })
 
  .catch(err => {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });    
};

