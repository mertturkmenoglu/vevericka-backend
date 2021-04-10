/* eslint-disable class-methods-use-this */
import { Service } from 'typedi';
import { Chat, ChatDocument } from '../../../../models/Chat';
import { User, UserDocument } from '../../../../models/User';

@Service()
class MessageService {
  async getChatById(id: string): Promise<ChatDocument | null> {
    return Chat
      .findById(id)
      .populate('users', 'username name image');
  }

  async areUsersValid(users: string[]): Promise<boolean> {
    const result = await Promise.all(users.map((userId) => User.findById(userId)));
    return !result.includes(null);
  }

  async getUserChats(userId: string) {
    return Chat
      .find({ users: { $elemMatch: { $eq: userId } } })
      .populate('users', 'username name image')
      .populate('lastMessage');
  }

  async canViewChat(chat: ChatDocument, user: UserDocument) {
    return chat.users.includes(user.id);
  }
}

export default MessageService;
