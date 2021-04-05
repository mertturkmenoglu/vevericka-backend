import express from 'express';
import isAuth from '../../../../middlewares/isAuth';
import authorize from '../authorization';
import validateDto from '../validateDto';
import MessageController from './MessageController';
import MessageService from './MessageService';

const router = express.Router();

const messageService = new MessageService();
const messageController = new MessageController(messageService);

router.post(
  '/chat/:id',
  isAuth,
  (req, res, next) => authorize('get-chat', req, res, next),
  (req, res, next) => validateDto('get-chat', req, res, next),
  (req, res, next) => messageController.getChatById(req, res, next),
);

router.post(
  '/chat/',
  isAuth,
  (req, res, next) => authorize('create-chat', req, res, next),
  (req, res, next) => validateDto('create-chat', req, res, next),
  (req, res, next) => messageController.createChat(req, res, next),
);

router.post(
  '/chat/user-chats/:username',
  isAuth,
  (req, res, next) => authorize('get-user-chats', req, res, next),
  (req, res, next) => messageController.getUserChats(req, res, next),
);

export default router;
