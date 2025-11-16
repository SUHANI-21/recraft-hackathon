import express from 'express';
const router = express.Router();
import { registerUser, loginUser, updateUserProfile, getArtisans, getUserById } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/', registerUser);
router.post('/login', loginUser);
router.route('/profile').put(protect, updateUserProfile);

// New Public Routes
router.get('/artisans', getArtisans);
router.get('/:id', getUserById);

export default router;