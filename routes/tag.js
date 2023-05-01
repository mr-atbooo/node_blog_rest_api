const express = require('express');

const tagController = require('../controllers/tag');
const Tag = require('../models/tag');
const router = express.Router();
const { check, body } = require('express-validator');

router.get('/', tagController.getTags);
// st store tag
router.post('/store',
[
    body('title',"title is not valid")
    .notEmpty().withMessage("title is required")
    .isString().withMessage("title must be string")
    .isLength({ min: 3 }).withMessage("title must be 3 length at minimum and 20 at maximum")
    .trim()
    .custom((value, { req }) => {
        return Tag.findOne({ title: value }).then(chTag => {
          if (chTag) {
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
        return Tag.findOne({ slug: value }).then(chTag => {
            if (chTag) {
            return Promise.reject(
                'The slug has already been taken.'
            );
            }
        });
    }),
],
tagController.storeTag);
// nd store tag

// st update tag
router.post('/update',
[
    body('id',"id is not valid")
    .notEmpty().withMessage("id is required")
    .isMongoId().withMessage("id is Not ObjectId")
    .custom((value, { req }) => {
        return Tag.findById(value ).then(chTag => {
          if (!chTag) {
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
        return Tag.findOne({ title: value,_id:{ $ne: req.body.id }}).then(chTag => {
          if (chTag) {
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
        return Tag.findOne({ slug: value,_id:{ $ne: req.body.id }}).then(chTag => {
            if (chTag) {
            return Promise.reject(
                'The slug has already been taken.'
            );
            }
        });
    }),
],
tagController.updateTag);
// nd update tag

// st show tag
router.get('/show',[
    check('id',"id is not valid")
    .notEmpty().withMessage("id is required")
    .isMongoId().withMessage("id is Not ObjectId")
    .custom((value, { req }) => {
        return Tag.findById(value).then(chCat => {
          if (!chCat) {
            return Promise.reject(
                'id is not valid.'
            );
          }
        });
      }),
],tagController.viewTag);
// nd show tag

//st delete category
router.post('/delete',
[
  body('ids',"ids is not valid")
  .notEmpty().withMessage("ids is required")
  .isArray().withMessage('ids must be an array '),
  body('ids.*', 'ids is Not ObjectId').isMongoId()
  .custom((value, { req }) => {
      return Tag.findById(value).then(chCat => {
        if (!chCat) {
          return Promise.reject(
              'id is not valid.'
          );
        }
      });
    }),
],
tagController.deleteTags);
//nd delete category 

module.exports = router;