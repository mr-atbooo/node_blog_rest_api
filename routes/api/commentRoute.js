const express = require('express');

const commentController = require('../../controllers/api/commentController');
const CommentValidation = require('../../validations/commentValidation');
const isAuth = require('../../middleware/api/is-auth');

const router = express.Router();

router.get('/',isAuth,commentController.getComments);
router.post('/store',isAuth,CommentValidation.store,commentController.storeComment);
router.post('/update',isAuth,CommentValidation.update,commentController.updateComment);
router.get('/show',CommentValidation.show,commentController.viewComment);
router.post('/delete',isAuth,CommentValidation.delete,commentController.deleteComments);

module.exports = router;