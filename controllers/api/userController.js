const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const UserController = require('../../models/userModel');

const fileHelper = require('../../util/file');

exports.getUsers = (req, res, next) => {
  const currentPage = +req.query.page || 1;
  const perPage = +req.query.size || 2;
  let totalItems;
  UserController.find()
    .countDocuments()
    .then(count => {
      totalItems = count;
      return UserController.find()
        .select('-posts -password')
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then(users => {
      res.status(200).json({
        message: 'Fetched users successfully.',
        users: users,
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

exports.storeUser =(req, res, next) => {
  const {name,email,fristName,lastName,website,role,status} = req.body
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const chImg = req.file;
    if (chImg) {
      fileHelper.deleteFile('images/'+ chImg.filename);
    }

    console.log(3);
    console.log(errors.array());
    return res.status(422).json({
      validationErrors: errors.array()
    });
  }

const img = req.file;

  bcrypt
    .hash(password, 12)
    .then(hashedPw => {
      const user = new UserController({
        name,email,fristName,lastName,website,role,status,
        password: hashedPw,
        ...(img) && {avatar: img.filename},
      });
      return user.save();
    })
    .then(result => {
      res.status(201).json({ message: 'UserController created!', userId: result._id });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
  });
      
};

exports.updateUser =(req, res, next) => {
  const id = req.body.id;
  const {name,email,fristName,lastName,website,role,status} = req.body
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(3);
    console.log(errors.array());
    return res.status(422).json({
      validationErrors: errors.array()
    });
  }

const img = req.file;
bcrypt
    .hash(password, 12)
    .then(hashedPw => {
      UserController.findById(id)
      .then(user=>{
        user.name = name;
        user.email = email;
        user.fristName = fristName;
        user.lastName = lastName;
        user.website = website;
        user.role = role;
        user.status = status;
        user.password = hashedPw;
        
        if (img) {
          fileHelper.deleteFile('images/'+user.avatar);
          user.avatar = img.filename;
        }
        return user.save()
      })
    })
  .then(result => { 
    res.status(200).json({
      message: 'UserController updated successfully!',
      post: result
    });
  })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
  });

 

};

exports.viewUser =(req, res, next) => {
  const getId = req.params.userId;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(3);
    console.log(errors.array());
    return res.status(422).json({
      validationErrors: errors.array()
    });
  }

  UserController.findById(getId)
  .populate('posts','title')
  .then(user=>{
      res.status(200).json({
        user: user,
      });
  })
  .catch(err => {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });    
};

exports.deleteUsers =(req, res, next) => {
  const userIds = req.body.ids;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).json({
      validationErrors: errors.array()
    });
  }

  UserController.find({'_id':{'$in':userIds}})
  .select('name avatar ')
    .then(users=>{
      users.forEach(element => {
        fileHelper.deleteFile('images/'+element.avatar);
      });

      UserController.deleteMany({'_id':{'$in':userIds}})
      .then(userss=>{
        res.status(200).json({
          message: "Users deleted successffly"
        });
      })
      
    })
 
  .catch(err => {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });    
};

