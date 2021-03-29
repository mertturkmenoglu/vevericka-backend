import express from 'express';

import authRoutes from './v2/authRoutes';
import postRoutes from './v2/postRoutes';
import userRoutes from './v2/userRoutes';
import messageRoutes from './v2/messageRoutes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/post', postRoutes);
router.use('/user', userRoutes);
router.use('/message', messageRoutes);

export default router;
