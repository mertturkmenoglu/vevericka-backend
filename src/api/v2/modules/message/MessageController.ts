import { NextFunction, Request, Response } from 'express';
import BadRequest from '../../../../errors/BadRequest';
import InternalServerError from '../../../../errors/InternalServerError';
import NotFound from '../../../../errors/NotFound';
import Unauthorized from '../../../../errors/Unauthorized';
import { Chat } from '../../../../models/Chat';
// eslint-disable-next-line no-unused-vars
import { Message } from '../../../../models/Message';
import { User } from '../../../../models/User';
import HttpCodes from '../../../../utils/HttpCodes';
import response from '../../../../utils/response';
import BaseController from '../../interfaces/BaseController';
import CreateChatDto from './dto/CreateChatDto';
import GetChatDto from './dto/GetChatDto';
import MessageService from './MessageService';

class MessageController extends BaseController {
  constructor(readonly messageService: MessageService) {
    super();
    this.messageService = messageService;
  }

  // eslint-disable-next-line class-methods-use-this
  async getChatById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const dto = req.body as GetChatDto;

    if (!id) {
      return next(new BadRequest('Id must be valid'));
    }

    const chat = await Chat
      .findById(id)
      .populate('users', 'username name image');

    if (!chat) {
      return next(new NotFound('Chat not found'));
    }

    const user = await User.findById(dto.userId);

    if (!user) {
      return next(new NotFound('User not found'));
    }

    if (!chat.users.includes(user.id)) {
      return next(new Unauthorized('This user cannot view this chat'));
    }

    if (chat.lastMessage !== null) {
      console.log(Message.modelName);
      const lastMessagePopulatedChat = await chat.populate('lastMessage');
      return res.json(response(lastMessagePopulatedChat));
    }

    return res.json(response(chat));
  }

  // eslint-disable-next-line class-methods-use-this
  async createChat(req: Request, res: Response, next: NextFunction) {
    const dto = req.body as CreateChatDto;

    if (!dto.users.includes(dto.createdBy)) {
      return next(new Unauthorized('User is not authorized to create this chat'));
    }

    const checkUsers = await Promise.all(dto.users.map((userId) => User.findById(userId)));

    // If any user does not exist
    if (checkUsers.includes(null)) {
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

  // eslint-disable-next-line class-methods-use-this
  async getUserChats(req: Request, res: Response, next: NextFunction) {
    const { username } = req.params;

    const user = await User.findOne({ username });

    if (!user) {
      return next(new NotFound('User not found'));
    }

    const chats = await Chat
      .find({ users: { $elemMatch: { $eq: user.id } } })
      .populate('users', 'username name image')
      .populate('lastMessage');

    return res.json(response(chats));
  }
}

export default MessageController;
