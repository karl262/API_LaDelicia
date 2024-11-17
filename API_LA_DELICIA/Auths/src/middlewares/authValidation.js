// const { body, validationResult } = require('express-validator');
import { body, validationResult } from 'express-validator';
//validaciones
const validateDataLogin = [

    body('username')
        .isString()
        .trim()
        .escape()
        .notEmpty().withMessage('Username or email is required')
        .optional({ checkFalsy: true }),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Invalid email format')
        .isString()
        .trim()
        .escape()
        .notEmpty().withMessage('Username or email is required')
        .optional({ checkFalsy: true }),
    body('password').notEmpty().withMessage('Password is required')
        .isString()
        .trim()
        .escape()
        .isLength({ min: 8, max: 16 })
        .withMessage('Password must be between 8 and 16 characters long'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

// module.exports = { validateDataLogin };
export { validateDataLogin };