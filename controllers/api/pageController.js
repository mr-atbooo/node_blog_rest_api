const { validationResult } = require('express-validator');
const PageController = require('../../models/pageModel');

const fileHelper = require('../../util/file');

exports.getPages = async(req, res, next) => {
  const currentPage = +req.query.page || 1;
  const perPage = +req.query.size || 2;
  try{
    const totalItems = await PageController.find().countDocuments();
    const pages = await PageController.find().skip((currentPage - 1) * perPage).limit(perPage);
    res.status(200).json({
          message: 'Fetched pages successfully.',
          pages: pages,
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

  }catch(err){
    res.status(500).json({
      error: err
    });
  }
};

exports.storePage = async(req, res, next) => {
  const title = req.body.title;
  const publish = req.body.publish;
  // const publishAt = req.body.publishAt;
  const publishAt = new Date('2021-10-26');
  const content = req.body.content;
  

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
  const chImg = req.file;
    if (chImg) {
      fileHelper.deleteFile('images/'+ chImg.filename);
    }

  console.log(errors.array());
  return res.status(422).json({
    validationErrors: errors.array()
  });
  // const error = new Error("validation vailed ,enter correct data");
  //   error.httpStatusCode = 422;
  //   throw error;
    // return next(error);
 
}



try
{
    const pageObj = new PageController({
      title :title,
      publish :publish,
      publishAt :publishAt,
      img :imgName,
      content:content,
  });
 
 const page = await pageObj.save();
   res.status(201).json({
     message: 'PageController created successfully!',
     page: page,
   });
}
catch(err) {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);     
}

};

exports.updatePage = async (req, res, next) => {
  const {id,title,content} = req.body
  const publish = req.body.publish;
  // const publishAt = req.body.publishAt;
  const publishAt = new Date('2021-10-26');
  const img = req.file;
  const errors = validationResult(req);

if (!errors.isEmpty()) {
  console.log(errors.array());
  return res.status(422).json({
    validationErrors: errors.array()
  });
}

try{
  const page = await PageController.findById(id);
    page.title = title;
    page.publish = publish;
    page.publishAt = publishAt;
    page.content = content;
    if (img) {
      fileHelper.deleteFile('images/'+post.img);
      page.img = img.filename;
    }
    const result = await page.save();
    res.status(200).json({
      message: 'Post updated successfully!',
      page: result
    });
}
catch(err)
{
  console.log(err);
  const error = new Error(err);
  error.httpStatusCode = 500;
  return next(error);
}
    
 
};

exports.viewPage = async (req, res, next) => {
  const pageId = req.params.pageId;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(3);
    console.log(errors.array());
    return res.status(422).json({
      validationErrors: errors.array()
    });
  }

  try
  {
    const page =  await PageController.findById(pageId);
    res.status(200).json({
      page: page,
    }); 
  }
  catch(err)
  {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
 
};

exports.deletePages = async (req, res, next) => {
  const pageIds = req.body.ids;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).json({
      validationErrors: errors.array()
    });
  }

  try
  {
    const pages = await PageController.find({'_id':{'$in':pageIds}}).select('title img ');
    const pagesDelete = pages.forEach(element => {
      fileHelper.deleteFile('images/'+element.img);
    })

    const pagesToDelete = await PageController.deleteMany({'_id':{'$in':pageIds}});
    res.status(200).json({
      message: "PageController deleted successffly"
    });

  }
  catch(err)
  {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }

     
};

