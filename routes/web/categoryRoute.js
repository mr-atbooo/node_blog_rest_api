const express = require('express');

const categoryController = require('../../controllers/web/categoryController');
const CategoryValidation = require('../../validations/categoryValidation');
const isAuth = require('../../middleware/web/is-auth');

const router = express.Router();

router.get('/', categoryController.getCategories);
router.post('/store',isAuth,CategoryValidation.store, categoryController.storeCategory);
router.post('/update',isAuth,CategoryValidation.update,categoryController.updateCategory);
router.get('/show',CategoryValidation.show,categoryController.viewCategory);
router.post('/delete',isAuth,CategoryValidation.delete, categoryController.deleteCategories);

module.exports = router;