import { Service } from 'typedi';
import UserRepository from '../repositories/UserRepository';
import { UserDocument } from '../models/User';

@Service()
class UserService {
  constructor(private readonly userRepository: UserRepository) {}

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
