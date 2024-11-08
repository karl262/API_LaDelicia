const express = require('express');
const authController = require('../controllers/authController');
const { validateDataLogin } = require('../middlewares/authValidation');

const router = express.Router();

router.get('/get/auth/by/:id', authController.getaAuthByid, authController.verifyToken);
router.post('/register/auth/user', validateDataLogin, authController.register, authController.verifyToken);
router.post('/login/user', validateDataLogin, authController.login);
router.post('/verify-token', authController.verifyToken);
module.exports = router;