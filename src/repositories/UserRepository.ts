import { Logger } from 'winston';
import { User, UserDocument } from '../models/User';

class UserRepository {
  constructor(private readonly logger: Logger) {
    this.logger = logger;
  }

  async insertUser(user: UserDocument): Promise<UserDocument | null> {
    try {
      const savedUser = await user.save();
      return savedUser;
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }

  async findUserById(id: string): Promise<UserDocument | null> {
    try {
      const user = await User.findById(id);
      return user;
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }

  async findUserByUsername(username: string): Promise<UserDocument | null> {
    try {
      const user = await User.findOne({ username });
      return user;
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }

  async findUserByEmail(email: string): Promise<UserDocument | null> {
    try {
      const user = await User.findOne({ email });
      return user;
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }

  async findUserByUsernameOrEmail(username: string, email: string): Promise<UserDocument | null> {
    try {
      const user = await User
        .findOne({ $or: [{ username: { $eq: username } }, { email: { $eq: email } }] });
      return user;
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }
}

export default UserRepository;
