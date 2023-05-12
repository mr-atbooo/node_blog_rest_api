const { validationResult } = require('express-validator');
const TagController = require('../../models/tagModel');
const Post = require('../../models/postModel');

exports.getTags = (req, res, next) => {
  
  TagController.find()
    .then(tags => {
      res.status(200).json({
        tags: tags
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

exports.storeTag =(req, res, next) => {
  const {title,slug,content} = req.body

  const errors = validationResult(req);
  
if (!errors.isEmpty()) {
  console.log(errors.array());
  return res.status(422).json({
    validationErrors: errors.array()
  });
}

  const tag = new TagController({title,slug,content});
  
  tag.save()
  .then(result => { 
    res.status(201).json({
      message: 'TagController created successfully!',
      tag: result
    });
  })
  .catch(err => {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });    
};

exports.updateTag =(req, res, next) => {
  const title = req.body.title;
  const slug = req.body.slug;
  const content = req.body.content;
  const id = req.body.id;

  const errors = validationResult(req);

if (!errors.isEmpty()) {
  console.log(errors.array());
  return res.status(422).json({
    validationErrors: errors.array()
  });
}

  TagController.findById(id)
    .then(tag=>{
      tag.title=title;
      tag.slug=slug;
      tag.content=content;
      return tag.save()
    })
  .then(result => { 
    res.status(201).json({
      message: 'Tage Updated successfully!',
      tag: result
    });
  })
  .catch(err => {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });    
};

exports.viewTag =(req, res, next) => {
  const tagId = req.query.id;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).json({
      validationErrors: errors.array()
    });
  }

  TagController.findById(tagId)
    .select('-createdAt -updatedAt')
    .then(tag=>{

      /******* st get posts *****************/
      const currentPage = +req.query.page || 1;
      const perPage = +req.query.size || 2;
      let totalItems;
      // Post.find({'tags':{'$in':tagIds}})
      Post.find( { "tags": tagId } )
      // Post.find( { "courses.courseName": "Database Design" } )
      .countDocuments()
      .then(count => {
      totalItems = count;
        return Post.find( { "tags": tagId } )
          .populate('categoryId','title')
          .populate('tags','title')
          .skip((currentPage - 1) * perPage)
          .limit(perPage);
      })
    .then(posts => {
      res.status(200).json({
        message: 'Fetched tag info with posts successfully.',
        tagInfo: tag,
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
    })
 
  .catch(err => {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });    
};


exports.deleteTags =(req, res, next) => {
  const tagIds = req.body.ids;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).json({
      validationErrors: errors.array()
    });
  }

  TagController.deleteMany({'_id':{'$in':tagIds}})
    .then(tag=>{
      res.status(200).json({
        message: "Tags deleted successffly"
      });
    })
 
  .catch(err => {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });    
};

exports.deleteAllTags =(req, res, next) => {


  TagController.deleteMany({})
    .then(tag=>{
      res.status(200).json({
        message: "All Tags deleted successffly"
      });
    })
  .catch(err => {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });    
};

