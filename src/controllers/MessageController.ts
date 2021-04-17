import {
  Authorized,
  BadRequestError,
  Body,
  Get,
  HttpCode,
  JsonController,
  NotFoundError,
  Param,
  Post,
  UnauthorizedError,
  UseBefore,
  UseInterceptor,
} from 'routing-controllers';
import { Service } from 'typedi';
import IsAuth from '../middlewares/IsAuth';
import { Role } from '../role';
import { Message } from '../models/Message';
import MessageService from '../services/MessageService';
import CreateChatDto from '../dto/CreateChatDto';
import { Chat } from '../models/Chat';
import { DocumentToJsonInterceptor } from '../interceptors/DocumentToJsonInterceptor';
import CreateMessageDto from '../dto/CreateMessageDto';

@JsonController('/api/v2/message')
@UseInterceptor(DocumentToJsonInterceptor)
@Service()
class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('/chat/:id')
  @UseBefore(IsAuth)
  @Authorized(Role.GET_CHAT)
  async getChatById(@Param('id') id: string) {
    const chat = await this.messageService.getChatById(id);

    if (!chat) {
      throw new NotFoundError('Chat not found');
    }

    if (chat.lastMessage !== null) {
      console.log(Message.modelName);
      return chat.populate('lastMessage');
    }

    return chat;
  }

  @HttpCode(201)
  @Post('/chat/')
  @UseBefore(IsAuth)
  @Authorized(Role.CREATE_CHAT)
  async createChat(@Body() dto: CreateChatDto) {
    if (!dto.users.includes(dto.createdBy)) {
      throw new UnauthorizedError('User is not authorized to create this chat');
    }

    const isValid = this.messageService.areUsersValid(dto.users);

    if (!isValid) {
      throw new BadRequestError('Chat users are not valid: One or more user(s) not found');
    }

    const chat = new Chat({
      users: dto.users,
      chatName: 'New Chat',
      isGroupChat: dto.users.length > 2,
      lastMessage: null,
    });

    return chat.save();
  }

  @Get('/chat/user-chats/:username')
  @UseBefore(IsAuth)
  @Authorized(Role.GET_USER_CHATS)
  async getUserChats(@Param('username') username: string) {
    const exists = await this.messageService.userExistsByUsername(username);

    if (!exists) {
      console.log('line 80', exists);
      throw new NotFoundError('User not found');
    }

    return this.messageService.getUserChats(username);
  }

  @Get('/chat/messages/:id')
  @UseBefore(IsAuth)
  @Authorized(Role.GET_CHAT_MESSAGES)
  async getChatMessages(@Param('id') id: string) {
    const chat = await this.messageService.getChatById(id);

    if (!chat) {
      throw new NotFoundError('Chat not found');
    }

    return this.messageService.getChatMessages(chat.id);
  }

  @Post('/')
  @UseBefore(IsAuth)
  @Authorized(Role.CREATE_MESSAGE)
  async createMessage(@Body() dto: CreateMessageDto) {
    const message = await this.messageService.createMessage(dto);

    if (!message) {
      throw new BadRequestError('Message body is not valid');
    }

    return message;
  }
}

export default MessageController;
