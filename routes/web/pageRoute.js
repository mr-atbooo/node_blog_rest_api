const express = require('express');
const multer = require('multer');

const pageController = require('../../controllers/api/pageController');
const PageValidation = require('../../validations/pageValidation');
const isAuth = require('../../middleware/api/is-auth');


const router = express.Router();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images');
    },
    filename: (req, file, cb) => {
      var temp_file_arr = file.originalname.split(".");
              var temp_file_name = temp_file_arr[0];
              var temp_file_extension = temp_file_arr[1];
        
      // cb(null, file.originalname);
      cb(null, temp_file_name + '-' + Date.now() + '.' + temp_file_extension);
    }
  });
const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
      
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };


router.get('/',isAuth, pageController.getPages);
router.post('/store'
    ,multer(
    { 
      storage: fileStorage,
     fileFilter: fileFilter 
    }
    ).single('image'),
    isAuth,
    PageValidation.store, pageController.storePage);
router.get('/show/:pageId',PageValidation.show,pageController.viewPage);
router.put('/update'
    ,multer(
    { 
      storage: fileStorage,
     fileFilter: fileFilter 
    }
    ).single('image'),
    isAuth,PageValidation.update, pageController.updatePage);

router.delete('/delete',isAuth,PageValidation.delete, pageController.deletePages);

module.exports = router;