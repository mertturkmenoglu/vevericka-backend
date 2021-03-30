import { UserDocument } from '../../models/User';
import UserRepository from '../../repositories/UserRepository';

class UserService {
  constructor(readonly userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async getUserByUsername(username: string): Promise<UserDocument | null> {
    return this.userRepository.findUserByUsernameSafe(username);
  }
}

export default UserService;
