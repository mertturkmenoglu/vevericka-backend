import { Service } from 'typedi';
import { Chat } from '../models/Chat';
import CreateMessageDto from '../dto/CreateMessageDto';
import { Message, MessageDocument } from '../models/Message';
import AddUserToChatDto from '../dto/AddUserToChatDto';
import RemoveUserFromChatDto from '../dto/RemoveUserFromChatDto';

@Service()
class MessageRepository {
  async getChatById(id: string) {
    return Chat.findById(id).populate('users', 'username name image');
  }

  async getUserChats(id: string) {
    return Chat.find({ users: { $elemMatch: { $eq: id } } })
      .populate('users', 'username name image')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });
  }

  async addMessage(dto: CreateMessageDto): Promise<MessageDocument | null> {
    try {
      const message = new Message({
        sender: dto.sender,
        content: dto.content,
        chat: dto.chat,
        readBy: [],
      });

      return await message.save();
    } catch (e) {
      return null;
    }
  }

  async getChatMessages(chatId: string) {
    try {
      return await Message.find({ chat: chatId }).populate('sender', 'name username image');
    } catch (e) {
      return [];
    }
  }

  async updateChatName(chatId: string, newChatName: string) {
    try {
      const chat = await Chat.findById(chatId);
      if (!chat) return null;
      chat.chatName = newChatName;
      return await chat.save();
    } catch (e) {
      return null;
    }
  }

  async updateChatLastMessage(message: MessageDocument) {
    try {
      const chat = await Chat.findById(message.chat);
      if (!chat) return null;
      chat.lastMessage = message.id;
      return await chat.save();
    } catch (e) {
      return null;
    }
  }

  async doesChatIncludeUser(chatId: string, userId: string): Promise<boolean> {
    const chat = await Chat.findById(chatId);
    if (!chat) return false;
    return chat.users.includes(userId);
  }

  async addUserToChat(dto: AddUserToChatDto) {
    try {
      const chat = await Chat.findById(dto.chatId);
      if (!chat) return null;
      if (chat.users.includes(dto.userId)) return null;
      chat.users.push(dto.userId);
      if (chat.users.length > 2) {
        chat.isGroupChat = true;
      }
      return await chat.save();
    } catch (e) {
      return null;
    }
  }

  async removeUserFromChat(dto: RemoveUserFromChatDto) {
    try {
      const chat = await Chat.findById(dto.chatId);
      if (!chat) return null;
      if (!chat.users.includes(dto.userId)) return null;
      // eslint-disable-next-line eqeqeq
      chat.users = chat.users.filter((id) => id != dto.userId);
      if (chat.users.length <= 2) {
        chat.isGroupChat = false;
      }
      return await chat.save();
    } catch (e) {
      return null;
    }
  }

  async deleteChat(id: string) {
    try {
      return await Chat.findByIdAndDelete(id);
    } catch (e) {
      return null;
    }
  }

  async deleteMessagesByChatId(chatId: string) {
    try {
      return await Message.deleteMany({ chat: chatId });
    } catch (e) {
      return null;
    }
  }
}

export default MessageRepository;
