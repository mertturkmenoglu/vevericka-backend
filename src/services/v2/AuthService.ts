import { UserDocument } from '../../models/User';
import UserRepository from '../../repositories/UserRepository';

class AuthService {
  constructor(private readonly repository: UserRepository) {
    this.repository = repository;
  }

  async createUser(user: UserDocument): Promise<UserDocument | null> {
    return this.repository.insertUser(user);
  }

  async userExists(username: string, email: string): Promise<Boolean> {
    const user = await this.repository.findUserByUsernameOrEmail(username, email);
    return !(user === null);
  }
}

export default AuthService;
