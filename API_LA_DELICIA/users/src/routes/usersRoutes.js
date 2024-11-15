import express from 'express';
import UserController from '../controllers/usersController.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/users', UserController.getAllUsers);
router.get('/users/:id', UserController.getUserById);
router.get('/users/name/:user_name', UserController.getUserByUserName);
router.post('/users', UserController.createUser);
router.put('/users/:id', UserController.updateUser);
router.delete('/users/:id', UserController.deleteUser);

export default router;

// module.exports = router;