const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const userModel = require('../../models/userModel');
const categoryModel = require('../../models/categoryModel');
const commentModel = require('../../models/commentModel');
const pageModel = require('../../models/pageModel');
const postModel = require('../../models/postModel');
const tagModel = require('../../models/tagModel');
const fileHelper = require('../../util/file');

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  bcrypt
    .hash(password, 12)
    .then(hashedPw => {
      const user = new userModel({
        email: email,
        password: hashedPw,
        name: name
      });
      return user.save();
    })
    .then(result => {
      res.status(201).json({ message: 'User created!', userId: result._id });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.index = (req, res, next) => {
  res.redirect('/dashboard');
};

exports.dashboard = async (req, res, next) => {
  try{
    
  console.log(req.user);
  console.log("*********************");
  const postCount = await postModel.find().countDocuments();
  const categoryCount = await categoryModel.find().countDocuments();
  const pageCount = await pageModel.find().countDocuments();
  const userCount = await userModel.find().countDocuments();
  const commentCount = await commentModel.find().countDocuments();
  const tagCount = await tagModel.find().countDocuments();

  console.log(tagCount);
  res.render('admin/dashboard',{
    pageTitle:'الصفحة الرئيسية',
    path:'/dashboard',
    csrfToken : req.csrfToken(),
    userName:req.user.fristName+' '+req.user.lastName,
    postCount:postCount,
    categoryCount:categoryCount,
    pageCount:pageCount,
    userCount:userCount,
    commentCount:commentCount,
    tagCount:tagCount
  });
  }
  catch(err){
    console.log(err);
    // res.redirect('/login');
  };
};

exports.getLogin = (req, res, next) => 
{
  if(req.session.isLoggedIn){
    return res.redirect('/dashboard');
  }
    res.render('auth/login',{
      pageTitle:'Login',
      path:'/login',
      pageTitle: 'Login',
      csrfToken : req.csrfToken(),
      hasError: false,
      emailValue:"",
      validationErrors: []
    });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).render('auth/login',{
      pageTitle:'Login',
      path:'/login',
      pageTitle: 'Login',
      csrfToken : req.csrfToken(),
      hasError: true,
      emailValue:email,
      validationErrors: errors.array()
    });
  }

  userModel.findOne({ email: email })
    .then(user => {
      if (!user) {
        let validationErrors = [{path:'email',msg:'Invalid email or password.'}];
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          errorMessage: 'Invalid email or password.',
          csrfToken : req.csrfToken(),
          hasError: true,
          emailValue:email,
          validationErrors: validationErrors
        });
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password).then(isEqual => {
        if (!isEqual) {
          let validationErrors = [{path:'password',msg:'Invalid email or password.'}];
          return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: 'Invalid email or password.',
            csrfToken : req.csrfToken(),
            hasError: true,
            emailValue:email,
            validationErrors: validationErrors
          });
        }
          req.session.isLoggedIn = true;
          req.session.user = user;
          console.log(user);
          console.log('well done brooooooooo');
          return req.session.save(err => {
            console.log(err);
            res.redirect('/');
          });
        
      })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

// exports.updateProfile =(req, res, next) => {
//   const id = req.userId;
//   const {name,email,fristName,lastName,website} = req.body
//   const password = req.body.password;
//
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     console.log(3);
//     console.log(errors.array());
//     return res.status(422).json({
//       validationErrors: errors.array()
//     });
//   }
//
// const img = req.file;
// bcrypt
//     .hash(password, 12)
//     .then(hashedPw => {
//       User.findById(id)
//       .then(user=>{
//         user.name = name;
//         user.email = email;
//         user.fristName = fristName;
//         user.lastName = lastName;
//         user.website = website;
//         user.password = hashedPw;
//
//         if (img) {
//
//           fileHelper.deleteFile('images/'+user.avatar);
//           user.avatar = img.filename;
//         }
//         return user.save()
//       })
//     })
//   .then(result => {
//     res.status(200).json({
//       message: 'Profile Data updated successfully!',
//       post: result
//     });
//   })
//     .catch(err => {
//       if (!err.statusCode) {
//         err.statusCode = 500;
//       }
//       next(err);
//   });
//
//
//
// };
//
// exports.profile =(req, res, next) => {
//   User.findById(req.userId)
//   .populate('posts','title')
//   .then(user=>{
//       res.status(200).json({
//         user: user,
//       });
//   })
//   .catch(err => {
//     console.log(err);
//     const error = new Error(err);
//     error.httpStatusCode = 500;
//     return next(error);
//   });
// };
