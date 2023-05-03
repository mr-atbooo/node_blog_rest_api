const { validationResult } = require('express-validator');
const Tag = require('../models/tag');

exports.getTags = (req, res, next) => {
  
  Tag.find()
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

  const tag = new Tag({title,slug,content});
  
  tag.save()
  .then(result => { 
    res.status(201).json({
      message: 'Tag created successfully!',
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

  Tag.findById(id)
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

  Tag.findById(tagId)
    .then(tag=>{
      res.status(200).json({
        tag: tag
      });
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

  Tag.deleteMany({'_id':{'$in':tagIds}})
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

