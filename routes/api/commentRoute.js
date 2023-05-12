const express = require('express');

const commentController = require('../../controllers/api/commentController');
const CommentRoute = require('../../models/commentModel');
const Post = require('../../models/postModel');
const isAuth = require('../../middleware/api/is-auth');

const router = express.Router();
const { check, body } = require('express-validator');

router.get('/', commentController.getComments);

// st store CommentRoute
router.post('/store',isAuth,
[
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
],
commentController.storeComment);
// nd store CommentRoute

// st update CommentRoute
router.post('/update',isAuth,
[
    body('id',"id is not valid")
    .notEmpty().withMessage("id is required")
    .isMongoId().withMessage("id is Not ObjectId")
    .custom((value, { req }) => {
        return CommentRoute.findById(value ).then(chCom => {
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
],
commentController.updateComment);
// nd update CommentRoute

// st show CommentRoute
router.get('/show',[
    check('id',"id is not valid")
    .notEmpty().withMessage("id is required")
    .isMongoId().withMessage("id is Not ObjectId")
    .custom((value, { req }) => {
        return CommentRoute.findById(value).then(chComment => {
          if (!chComment) {
            return Promise.reject(
                'id is not valid.'
            );
          }
        });
      }),
],commentController.viewComment);
// nd show CommentRoute

//st delete CommentRoute
router.post('/delete',isAuth,
[
  body('ids',"ids is not valid")
  .notEmpty().withMessage("ids is required")
  .isArray().withMessage('ids must be an array '),
  body('ids.*', 'ids is Not ObjectId').isMongoId()
  .custom((value, { req }) => {
      return CommentRoute.findById(value).then(chComment => {
        if (!chComment) {
          return Promise.reject(
              'comment is not valid.'
          );
        }
      });
    }),
],
commentController.deleteComments);
//nd delete CommentRoute

module.exports = router;