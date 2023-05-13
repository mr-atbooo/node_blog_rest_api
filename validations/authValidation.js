const {body} = require("express-validator");
const User = require("../models/userModel");
exports.signup = [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom((value, { req }) => {
            return User.findOne({ email: value }).then(userDoc => {
                if (userDoc) {
                    return Promise.reject('E-Mail address already exists!');
                }
            });
        })
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({ min: 5 }),
    body('name')
        .trim()
        .not()
        .isEmpty()
];
exports.login = [
        body('email')
            .notEmpty().withMessage('Email field is required.')
            .isEmail().withMessage('Please enter a valid email.')
            .normalizeEmail()
            .custom((value, { req }) => {
                return User.findOne({ email: value }).then(userDoc => {
                    if (!userDoc) {
                        return Promise.reject(
                            'Invalid email or password.'
                        );
                    }
                });
            }),
        body(
            'password',
            'Please enter a password with only numbers and text and at least 5 characters.'
        )
            .notEmpty().withMessage('Password field is required.')
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim(),
    ];
exports.updateProfile=[
    body('name',"name is not valid")
        .notEmpty().withMessage("name is required")
        .isString().withMessage("name must be string")
        .isLength({ min: 3 }).withMessage("name must be 3 length at minimum and 20 at maximum")
        .trim(),
    body('password',"password is not valid")
        .notEmpty().withMessage("password is required")
        .isLength({ min: 6 }).withMessage("password must be 6 length at minimum and 20 at maximum")
        .trim(),
    body('email')
        .notEmpty().withMessage("email is required")
        .isEmail().withMessage('Please enter a valid email.')
        .custom((value, { req }) => {
            return User
                .findOne({ email: value,_id:{ $ne: req.userId }})
                .then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('E-Mail address already exists!');
                    }
                });
        })
        .normalizeEmail(),
];