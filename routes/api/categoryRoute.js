const express = require('express');

const categoryController = require('../../controllers/api/categoryController');
const CategoryRoute = require('../../models/categoryModel');
const isAuth = require('../../middleware/api/is-auth');

const router = express.Router();
const { check, body } = require('express-validator');

router.get('/', categoryController.getCategories);
// st store category
router.post('/store',isAuth,
[
    body('title',"title is not valid")
    .notEmpty().withMessage("title is required")
    .isString().withMessage("title must be string")
    .isLength({ min: 3 }).withMessage("title must be 3 length at minimum and 20 at maximum")
    .trim()
    .custom((value, { req }) => {
        console.log(value);
        console.log("*********************");
        return CategoryRoute.findOne({ title: value }).then(chCat => {
          if (chCat) {
            return Promise.reject(
              'The title has already been taken.'
            );
          }
        });
      }),
    body('slug',"slug is not valid")
    .notEmpty().withMessage("slug is required")
    .isString().withMessage("slug must be string")
    .isLength({ min: 3 }).withMessage("slug must be 3 length at minimum and 20 at maximum")
    .trim()
    .custom((value, { req }) => {
        return CategoryRoute.findOne({ slug: value }).then(chCat => {
            if (chCat) {
            return Promise.reject(
                'The slug has already been taken.'
            );
            }
        });
    }),
    body('parent_id',"parent_id is not valid")
    // .custom((value, { req }) => {
    //     return CategoryRoute.findById(value)
    //     .then(chCat => {
    //         if (!chCat) {
    //         return Promise.reject(
    //             'The parent_id not Valid.'
    //         );
    //         }
    //     });
    // }),
],
categoryController.storeCategory);
// nd store category

// st update category
router.post('/update',isAuth,
[
    body('id',"id is not valid")
    .notEmpty().withMessage("id is required")
    .isMongoId().withMessage("id is Not ObjectId")
    .custom((value, { req }) => {
        return CategoryRoute.findById(value ).then(chCat => {
          if (!chCat) {
            return Promise.reject(
              'id is not valid.'
            );
          }
        });
      }),
    body('title',"title is not valid")
    .notEmpty().withMessage("title is required")
    .isString().withMessage("title must be string")
    .isLength({ min: 3 }).withMessage("title must be 3 length at minimum and 20 at maximum")
    .trim()
    .custom((value, { req }) => {
        return CategoryRoute.findOne({ title: value,_id:{ $ne: req.body.id }}).then(chCat => {
          if (chCat) {
            return Promise.reject(
              'The title has already been taken.'
            );
          }
        });
      }),
    body('slug',"slug is not valid")
    .notEmpty().withMessage("slug is required")
    .isString().withMessage("slug must be string")
    .isLength({ min: 3 }).withMessage("slug must be 3 length at minimum and 20 at maximum")
    .trim()
    .custom((value, { req }) => {
        return CategoryRoute.findOne({ slug: value,_id:{ $ne: req.body.id }}).then(chCat => {
            if (chCat) {
            return Promise.reject(
                'The slug has already been taken.'
            );
            }
        });
    }),
    body('parent_id',"parent_id is not valid")
    // .isMongoId().withMessage("parent_id is Not ObjectId")
    .custom((value, { req }) => {
        if(req.body.parent_id == req.body.id){
            return Promise.reject(
                'The parent_id Can not be Same Id.'
            );
        }
        else
        {
            if(value){
                return CategoryRoute.findById(value)
                .then(chCat => {
                    if (!chCat) {
                    return Promise.reject(
                        'The parent_id not Valid.'
                    );
                    }
                });
            }
           

        }
        // return CategoryRoute.findById(value)
        // .then(chCat => {
        //     if (!chCat) {
        //     return Promise.reject(
        //         'The parent_id not Valid.'
        //     );
        //     }
        // });
    }),
],
categoryController.updateCategory);
// nd update category

// st show category
router.get('/show',[
    check('id',"id is not valid")
    .notEmpty().withMessage("id is required")
    .isMongoId().withMessage("id is Not ObjectId")
    .custom((value, { req }) => {
        return CategoryRoute.findById(value).then(chCat => {
          if (!chCat) {
            return Promise.reject(
                'id is not valid.'
            );
          }
        });
      }),
],categoryController.viewCategory);
// nd show category

//st delete category
router.post('/delete',isAuth,
[
  body('ids',"ids is not valid")
  .notEmpty().withMessage("ids is required")
  .isArray().withMessage('ids must be an array '),
  body('ids.*', 'ids is Not ObjectId').isMongoId()
  .custom((value, { req }) => {
      return CategoryRoute.findById(value).then(chCat => {
        if (!chCat) {
          return Promise.reject(
              'id is not valid.'
          );
        }
      });
    }),
],
categoryController.deleteCategories);
//nd delete category 

module.exports = router;