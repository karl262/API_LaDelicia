const express = require('express');
const authController = require('../controllers/authController');
const { validateDataLogin } = require('../middlewares/authValidation');

const router = express.Router();

router.post('/login',validateDataLogin, authController.login);
router.post('/verify-token', authController.verifyToken);
module.exports = router;