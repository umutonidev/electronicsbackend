// routes/userRoutes.js
import express from 'express';
import {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    deleteUser,
    getUserById,
    updateUser
} from '../controllers/userController.js';
import { isAuth, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected Routes
router.get('/profile', isAuth, getUserProfile);
router.put('/profile', isAuth, updateUserProfile);

// Admin Protected Routes
router.get('/', isAuth, isAdmin, getAllUsers);
router.delete('/:id', isAuth, isAdmin, deleteUser);
router.get('/:id', isAuth, isAdmin, getUserById);
router.put('/:id', isAuth, isAdmin, updateUser);

export default router;