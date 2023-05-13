const { check, body } = require('express-validator');

const Post = require("../models/postModel");
const Comment = require("../models/commentModel");

exports.store =[
    body('text',"text is not valid")
    .notEmpty().withMessage("text is required")
    .isString().withMessage("text must be string")
    .isLength({ min: 3 }).withMessage("text must be 3 length at minimum and 20 at maximum")
    .trim(),
    body('post', 'post is Not ObjectId').isMongoId()
    .custom((value, { req }) => {
        return Post.findById(value).then(chPost => {
          if (!chPost) {
            return Promise.reject(
                'post is not valid.'
            );
          }
        });
      }),
];
exports.update = [
    body('id',"id is not valid")
    .notEmpty().withMessage("id is required")
    .isMongoId().withMessage("id is Not ObjectId")
    .custom((value, { req }) => {
        return Comment.findById(value ).then(chCom => {
          if (!chCom) {
            return Promise.reject(
              'id is not valid.'
            );
          }
        });
      }),
    body('text',"text is not valid")
    .notEmpty().withMessage("text is required")
    .isString().withMessage("text must be string")
    .isLength({ min: 3 }).withMessage("text must be 3 length at minimum and 20 at maximum")
    .trim(),
];
exports.show =[
    check('id',"id is not valid")
    .notEmpty().withMessage("id is required")
    .isMongoId().withMessage("id is Not ObjectId")
    .custom((value, { req }) => {
        return Comment.findById(value).then(chComment => {
          if (!chComment) {
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
      return Comment.findById(value).then(chComment => {
        if (!chComment) {
          return Promise.reject(
              'comment is not valid.'
          );
        }
      });
    }),
];
