import { UserDocument } from '../../../../models/User';
import UserRepository from './UserRepository';

class UserService {
  constructor(readonly userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async getUserByUsername(username: string): Promise<UserDocument | null> {
    return this.userRepository.findUserByUsernameSafe(username);
  }

  async getUserById(id: string): Promise<UserDocument | null> {
    return this.userRepository.findUserByIdSafe(id);
  }

  async searchUsers(query: string) {
    return this.userRepository.searchUsers(query);
  }
}

export default UserService;
