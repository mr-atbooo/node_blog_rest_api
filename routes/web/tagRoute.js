const express = require('express');

const tagController = require('../../controllers/web/tagController');
const isAuth = require('../../middleware/web/is-auth');
const TagValidation = require('../../validations/tagValidation');
const router = express.Router();

const csrf = require('csurf');
const csrfProtection = csrf();

// app.use(csrfProtection);

router.get('/', isAuth,csrfProtection,tagController.getTags);
router.post('/store',csrfProtection,isAuth,TagValidation.store, tagController.storeTag);

router.post('/update',csrfProtection,isAuth,TagValidation.update,tagController.updateTag);
router.get('/show',csrfProtection,isAuth,TagValidation.show,tagController.viewTag);

router.post('/delete',csrfProtection,TagValidation.delete, tagController.deleteTags);
router.post('/delete-all',isAuth,isAuth,tagController.deleteAllTags);

module.exports = router;