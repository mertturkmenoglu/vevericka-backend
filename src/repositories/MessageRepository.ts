import { Service } from 'typedi';
import { Chat } from '../models/Chat';
import CreateMessageDto from '../dto/CreateMessageDto';
import { Message, MessageDocument } from '../models/Message';

@Service()
class MessageRepository {
  async getChatById(id: string) {
    return Chat.findById(id).populate('users', 'username name image');
  }

  async getUserChats(id: string) {
    return Chat.find({ users: { $elemMatch: { $eq: id } } })
      .populate('users', 'username name image')
      .populate('lastMessage');
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
}

export default MessageRepository;
