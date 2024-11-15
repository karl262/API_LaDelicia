const express = require('express');
const UserController = require('../controllers/usersController');
const AuthMiddleware = require('../middlewares/auth');

const router = express.Router();

router.use(AuthMiddleware.authMiddleware);

router.get('/get/users', UserController.getAllUsers);
router.get('/get/users/by/:id', UserController.getUserById);
router.get('/get/users/username/:user_name', UserController.getUserByUserName);
router.post('/create/user', UserController.createUser);
router.put('/update/user/:id', UserController.updateUser);
router.delete('/delete/user/:id', UserController.deleteUser);

module.exports = router;