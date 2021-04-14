import { Service } from 'typedi';
import { Chat } from '../models/Chat';

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
}

export default MessageRepository;
