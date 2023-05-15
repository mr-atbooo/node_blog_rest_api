const Tag = require('../models/tagModel');
const { check, body } = require('express-validator');

exports.store = [
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
    body('content',"Content is not valid")
    .notEmpty().withMessage("Content is required")
];
exports.update = [
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
    body('content',"Content is not valid")
    .notEmpty().withMessage("Content is required")
];
exports.show = [
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
];
exports.delete = [
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
];