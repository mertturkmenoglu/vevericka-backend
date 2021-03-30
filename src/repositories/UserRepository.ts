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

  async findUserByIdUnsafe(id: string): Promise<UserDocument | null> {
    try {
      const user = await User.findById(id, '+password');
      return user;
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }

  async findUserByUsernameUnsafe(username: string): Promise<UserDocument | null> {
    try {
      const user = await User.findOne({ username }, '+password');
      return user;
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }

  async findUserByUsernameSafe(username: string): Promise<UserDocument | null> {
    try {
      const user = await User.findOne({ username });
      return user;
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }

  async findUserByEmailUnsafe(email: string): Promise<UserDocument | null> {
    try {
      const user = await User.findOne({ email }, '+password');
      return user;
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }

  async findUserByUsernameOrEmailUnsafe(
    username: string,
    email: string,
  ): Promise<UserDocument | null> {
    try {
      const user = await User
        .findOne(
          { $or: [{ username }, { email }] },
          '+password',
        );
      return user;
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }
}

export default UserRepository;
