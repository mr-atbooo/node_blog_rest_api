const express = require('express');

const tagController = require('../../controllers/api/tagController');
const isAuth = require('../../middleware/api/is-auth');
const TagValidation = require('../../validations/tagValidation');
const router = express.Router();

router.get('/', isAuth,tagController.getTags);
router.post('/store',isAuth,TagValidation.store, tagController.storeTag);
router.post('/update',isAuth,TagValidation.update,tagController.updateTag);
router.get('/show',TagValidation.show,tagController.viewTag);
router.post('/delete',isAuth,TagValidation.delete, tagController.deleteTags);
router.post('/delete-all',isAuth,tagController.deleteAllTags);

module.exports = router;