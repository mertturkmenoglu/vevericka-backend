import { NextFunction, Request, Response } from 'express';
import BadRequest from '../../../../errors/BadRequest';
import InternalServerError from '../../../../errors/InternalServerError';
import Unauthorized from '../../../../errors/Unauthorized';
import { Chat } from '../../../../models/Chat';
import { User } from '../../../../models/User';
import HttpCodes from '../../../../utils/HttpCodes';
import response from '../../../../utils/response';
import BaseController from '../../interfaces/BaseController';
import CreateChatDto from './dto/CreateChatDto';
import MessageService from './MessageService';

class MessageController extends BaseController {
  constructor(readonly messageService: MessageService) {
    super();
    this.messageService = messageService;
  }

  // eslint-disable-next-line class-methods-use-this
  async createChat(req: Request, res: Response, next: NextFunction) {
    const dto = req.body as CreateChatDto;

    if (!dto.users.includes(dto.createdBy)) {
      return next(new Unauthorized('User is not authorized to create this chat'));
    }

    const checkUsers = await Promise.all(dto.users.map((userId) => User.findById(userId)));

    // If any user does not exist
    if (!checkUsers.includes(null)) {
      return next(new BadRequest('Chat users are not valid: User does not exist'));
    }

    const chat = new Chat({
      users: dto.users,
      chatName: 'New Chat',
      isGroupChat: dto.users.length > 2,
      lastMessage: null,
    });

    try {
      const savedChat = await chat.save();
      return res.status(HttpCodes.CREATED).json(response(savedChat));
    } catch (e) {
      return next(new InternalServerError('Server error: Cannot create chat'));
    }
  }
}

export default MessageController;
