const express = require('express');
const authController = require('../controllers/authController');
const { validateDataLogin } = require('../middlewares/authValidation');

const router = express.Router();

router.post('/login', authController.login);
router.post('/verify-token', authController.verifyToken);
module.exports = router;