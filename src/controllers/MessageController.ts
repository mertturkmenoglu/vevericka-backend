import {
  Authorized,
  BadRequestError,
  Body,
  Delete,
  Get,
  HttpCode,
  JsonController,
  NotFoundError,
  Param,
  Post,
  Put,
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
import UpdateChatNameDto from '../dto/UpdateChatNameDto';
import AddUserToChatDto from '../dto/AddUserToChatDto';
import RemoveUserFromChatDto from '../dto/RemoveUserFromChatDto';

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

  @Put('/update-chat-name')
  @UseBefore(IsAuth)
  @Authorized(Role.UPDATE_CHAT_NAME)
  async updateChatName(@Body() dto: UpdateChatNameDto) {
    const chat = await this.messageService.changeChatName(dto);

    if (!chat) {
      throw new BadRequestError('Chat is not valid');
    }

    return chat;
  }

  @Put('/chat/add-user')
  @UseBefore(IsAuth)
  @Authorized(Role.CHAT_ADD_USER)
  async addUserToChat(@Body() dto: AddUserToChatDto) {
    const response = await this.messageService.addUserToChat(dto);

    if (!response) {
      return {
        message: 'Cannot add user to chat',
      };
    }

    return response;
  }

  @Put('/chat/remove-user')
  @UseBefore(IsAuth)
  @Authorized(Role.CHAT_REMOVE_USER)
  async removeUserFromChat(@Body() dto: RemoveUserFromChatDto) {
    const response = await this.messageService.removeUserFromChat(dto);

    if (!response) {
      return {
        message: 'Cannot remove user from chat',
      };
    }

    return response;
  }

  @Delete('/chat/:id')
  @UseBefore(IsAuth)
  @Authorized(Role.DELETE_CHAT)
  async deleteChat(@Param('id') id: string) {
    await this.messageService.deleteChat(id);
    return {
      message: 'Chat deleted',
    };
  }
}

export default MessageController;
