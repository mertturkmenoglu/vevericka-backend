import express from 'express';

import authRoutes from './modules/auth/authRoutes';
import postRoutes from './modules/post/postRoutes';
import userRoutes from './modules/user/userRoutes';
import messageRoutes from './modules/message/messageRoutes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/post', postRoutes);
router.use('/user', userRoutes);
router.use('/message', messageRoutes);

export default router;
