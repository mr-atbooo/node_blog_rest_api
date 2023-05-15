const { validationResult } = require('express-validator');
const Category = require('../../models/categoryModel');
const Post = require('../../models/postModel');

exports.getCategories = (req, res, next) => {
  
  Category.find()
  .populate('parentId','title')
    .then(categories => {
      res.render('admin/categories/index', {
        categories: categories,
        pageTitle: 'التصنيفات',
        path: '/dashboard/categories'
      });

    }
    )
    .catch(err => { 
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
  

if (!errors.isEmpty()) {
  console.log(errors.array());
  return res.status(422).json({
    validationErrors: errors.array()
  });
}

  const category = new Category({
    title:title,
    slug:slug,
    ...(parentId != "") && {parentId: parentId},
    content:content,
  });
  
  category.save()
  .then(result => { 
    res.status(201).json({
      message: 'Category created successfully!',
      category: result
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

if (!errors.isEmpty()) {
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
      category.parentId =parentId;
      }
      return category.save()
    })
  .then(result => { 
    res.status(201).json({
      message: 'Category Updated successfully!',
      category: result
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
    console.log(errors.array());
    return res.status(422).json({
      validationErrors: errors.array()
    });
  }

  Category.findById(catId)
    .select('-createdAt -updatedAt -__v')
    .then(category=>{
  
      /******* st get posts *****************/
      const currentPage = +req.query.page || 1;
      const perPage = +req.query.size || 2;
      let totalItems;
      Post.find( { "categoryId": catId } )
      .countDocuments()
      .then(count => {
      totalItems = count;
        return Post.find( { "categoryId": catId } )
          .populate('categoryId','title')
          .populate('tags','title')
          .skip((currentPage - 1) * perPage)
          .limit(perPage);
      })
    .then(posts => {
      res.status(200).json({
        message: 'Fetched category info with posts successfully.',
        categoryInfo: category,
        postsInfo: {
          posts:posts,
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
        },
       
        
      });
    }
    )
      /******* nd get posts *****************/
      // res.status(200).json({
      //   category: category
      // });
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
    console.log(errors.array());
    return res.status(422).json({
      validationErrors: errors.array()
    });
  }

  Category.deleteMany({'_id':{'$in':catIds}})
    .then(category=>{
      res.status(200).json({

        message: "Categories deleted successfully"
      });
    })
 
  .catch(err => {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });    
};

