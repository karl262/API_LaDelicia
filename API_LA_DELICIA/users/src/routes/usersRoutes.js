const express = require('express');
const UserController = require('../controllers/usersController');
const AuthMiddleware = require('../middlewares/auth');

const router = express.Router();

router.use(AuthMiddleware.authMiddleware);

router.get('/users', UserController.getAllUsers);
router.get('/users/:id', UserController.getUserById);
router.get('/users/name/:user_name', UserController.getUserByUserName);
router.post('/users', UserController.createUser);
router.put('/users/:id', UserController.updateUser);
router.delete('/users/:id', UserController.deleteUser);

module.exports = router;

