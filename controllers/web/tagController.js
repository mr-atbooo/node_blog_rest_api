const { validationResult } = require('express-validator');
const Tag = require('../../models/tagModel');
const Post = require('../../models/postModel');
const io = require('../../socket');

exports.getTags = (req, res, next) => {
  
  Tag.find()
    .then(tags => {

      let messageSuc = req.flash('success');
      if (messageSuc.length > 0) {
        messageSuc = messageSuc[0];
      } else {
        messageSuc = null;
      }

      let messageErr = req.flash('success');
      if (messageErr.length > 0) {
        messageErr = messageErr[0];
      } else {
        messageErr = null;
      }

      res.render('admin/tags/index', {
        tags: tags,
        pageTitle: 'الوسوم',
        path: '/dashboard/tags',
        hasError: false,
        successMessage:messageSuc,
        errorMessage:messageErr,
        csrfToken : req.csrfToken(),
        tage: {
          title: '',
          content: '',
          slug: ''
        },
        validationErrors: []
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

exports.storeTag = async (req, res, next) => {
  const {title,slug,content} = req.body

  const errors = validationResult(req);
  
if (!errors.isEmpty()) {
  console.log(errors.array());

  try{
    const tags = await Tag.find();

    console.log(errors.array());
    
  
   
    res.render('admin/tags/index', {
      tags: tags,
      pageTitle: 'الوسوم',
      path: '/dashboard/tags',
      successMessage:null,
      errorMessage:null,
      hasError: true,
      csrfToken : req.csrfToken(),
      titleValue: title,
      contentValue: content,
      slugValue: slug,
      validationErrors: errors.array()
    });


  }catch(err){
    console.log(err);
  }
  

}

  const tag = new Tag({title,slug,content});
  
  tag.save()
  .then(result => { 
    let xx = io.getIO().emit('tag', {
      action: 'create',
      tag: result
    });
    res.redirect('/dashboard/tags');
  })
  .catch(err => {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });    
};

exports.updateTag =(req, res, next) => {
  const {title,slug,content} = req.body
  const id = req.body.id;

  const errors = validationResult(req);

if (!errors.isEmpty()) 
{
  // console.log(errors.array());
  // return res.status(422).json({
  //   validationErrors: errors.array()
  // });
  const tag ={_id:id,title:title,slug:slug,content:content};

  res.render('admin/tags/view', {
    tag: tag,
    pageTitle: "edit Tag",
    path: '/dashboard/tags',
    editing:true,
    hasError: true,
    csrfToken : req.csrfToken(),
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
    // res.status(201).json({
    //   message: 'Tage Updated successfully!',
    //   tag: result
    // });
    let xx = io.getIO().emit('tag', {
      action: 'update',
      tagId: result
    });
    req.flash('success', 'Tage Updated successfully!');
    res.redirect('/dashboard/tags');
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
      res.render('admin/tags/view', {
        tag: tag,
        pageTitle: "edit Tag",
        path: '/dashboard/tags',
        editing:true,
        hasError: false,
        csrfToken : req.csrfToken(),
        validationErrors: []
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

  Tag.deleteMany({'_id':{'$in':tagIds}})
    .then(tag=>{
      // res.status(200).json({
      //   message: "Tags deleted successfully"
      // });
      let xx = io.getIO().emit('tag', {
        action: 'delete',
        tagId: tagIds[0]
      });
      res.redirect('/dashboard/tags');
    })
 
  .catch(err => {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });    
};

exports.deleteAllTags =(req, res, next) => {


  Tag.deleteMany({})
    .then(tag=>{
      res.status(200).json({
        message: "All Tags deleted successfully"
      });
    })
  .catch(err => {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });    
};

