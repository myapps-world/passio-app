import express from 'express';
import { login, register, getCurrentUser, updateProfile, socialAuth } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/register', register);
router.post('/social', socialAuth);

// Protected routes
router.get('/me', authMiddleware, getCurrentUser);
router.put('/profile', authMiddleware, updateProfile);

export default router;
