import { Request, Response } from 'express';
import { Service } from 'typedi';
import BadRequest from '../../../../errors/BadRequest';
import NotFound from '../../../../errors/NotFound';
import Unauthorized from '../../../../errors/Unauthorized';
import { Chat } from '../../../../models/Chat';
// eslint-disable-next-line no-unused-vars
import { Message } from '../../../../models/Message';
import { User } from '../../../../models/User';
import HttpCodes from '../../../../utils/HttpCodes';
import response from '../../../../utils/response';
import CreateChatDto from './dto/CreateChatDto';
import GetChatDto from './dto/GetChatDto';
import MessageService from './MessageService';

@Service()
class MessageController {
  constructor(private readonly messageService: MessageService) { }

  async getChatById(req: Request, res: Response) {
    const { id } = req.params;
    const dto = req.body as GetChatDto;

    if (!id) {
      throw new BadRequest('Id must be valid');
    }

    const chat = await this.messageService.getChatById(id);

    if (!chat) {
      throw new NotFound('Chat not found');
    }

    const user = await User.findById(dto.userId);

    if (!user) {
      throw new NotFound('User not found');
    }

    if (!chat.users.includes(user.id)) {
      throw new Unauthorized('This user cannot view this chat');
    }

    if (chat.lastMessage !== null) {
      console.log(Message.modelName);
      const lastMessagePopulatedChat = await chat.populate('lastMessage');
      return res.json(response(lastMessagePopulatedChat));
    }

    return res.json(response(chat));
  }

  // eslint-disable-next-line class-methods-use-this
  async createChat(req: Request, res: Response) {
    const dto = req.body as CreateChatDto;

    if (!dto.users.includes(dto.createdBy)) {
      throw new Unauthorized('User is not authorized to create this chat');
    }

    const isValid = this.messageService.areUsersValid(dto.users);

    if (!isValid) {
      throw new BadRequest('Chat users are not valid: One or more user(s) not found');
    }

    const chat = new Chat({
      users: dto.users,
      chatName: 'New Chat',
      isGroupChat: dto.users.length > 2,
      lastMessage: null,
    });

    const savedChat = await chat.save();
    return res.status(HttpCodes.CREATED).json(response(savedChat));
  }

  // eslint-disable-next-line class-methods-use-this
  async getUserChats(req: Request, res: Response) {
    const { username } = req.params;

    const user = await User.findOne({ username });

    if (!user) {
      throw new NotFound('User not found');
    }

    const chats = await this.messageService.getUserChats(user.id);
    return res.json(response(chats));
  }
}

export default MessageController;
