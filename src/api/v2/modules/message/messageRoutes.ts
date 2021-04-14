import express from 'express';
import asyncHandler from 'express-async-handler';
import { Container } from 'typedi';
import IsAuth from '../../../../middlewares/IsAuth';
import authorize from '../authorization';
import validateDto from '../validateDto';
import MessageController from './MessageController';

const router = express.Router();
const messageController = Container.get(MessageController);

router.post(
  '/chat/:id',
  IsAuth,
  asyncHandler(async (req, res, next) => authorize('get-chat', req, res, next)),
  asyncHandler(async (req, res, next) => validateDto('get-chat', req, res, next)),
  asyncHandler(async (req, res) => messageController.getChatById(req, res)),
);

router.post(
  '/chat/',
  IsAuth,
  asyncHandler(async (req, res, next) => authorize('create-chat', req, res, next)),
  asyncHandler(async (req, res, next) => validateDto('create-chat', req, res, next)),
  asyncHandler(async (req, res) => messageController.createChat(req, res)),
);

router.post(
  '/chat/user-chats/:username',
  IsAuth,
  asyncHandler(async (req, res, next) => authorize('get-user-chats', req, res, next)),
  asyncHandler(async (req, res) => messageController.getUserChats(req, res)),
);

router.post(
  '/chat/messages/:id',
  IsAuth,
  asyncHandler(async (req, res, next) => authorize('get-chat-messages', req, res, next)),
  asyncHandler(async (req, res) => messageController.getChatMessages(req, res)),
);

export default router;
