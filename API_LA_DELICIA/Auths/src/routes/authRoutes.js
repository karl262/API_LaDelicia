// const express = require('express');
// const authController = require('../controllers/authController.js');
// const { validateDataLogin } = require('../middlewares/authValidation.js');
import express from 'express';
import authController from '../controllers/authController.js';
import { validateDataLogin } from '../middlewares/authValidation.js';
const router = express.Router();

router.get('/get/auth/by/:id', authController.getaAuthByid, authController.verifyToken);
router.post('/register/auth/user', validateDataLogin, authController.register, authController.verifyToken);
router.post('/login/user', validateDataLogin, authController.login);
router.post('/verify-token', authController.verifyToken);

router.get('/health', (req, res) => {
    res.status(200).json({
      status: 'OK',
      service: 'auth-service',
      timestamp: new Date().toISOString()
    });
  });

// module.exports = router;
export default router;