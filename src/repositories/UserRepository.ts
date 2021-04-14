import { Service } from 'typedi';
import { User, UserDocument } from '../models/User';

@Service()
class UserRepository {
  async searchUsers(query: string, limit = 100): Promise<UserDocument[] | null> {
    try {
      return await User.find({ username: { $regex: `.*${query}.*` } }, 'username name image').limit(
        limit,
      );
    } catch (e) {
      return null;
    }
  }

  async findUserByIdSafe(id: string): Promise<UserDocument | null> {
    try {
      return await User.findById(id);
    } catch (e) {
      return null;
    }
  }

  async findUserByUsernameSafe(username: string): Promise<UserDocument | null> {
    try {
      return await User.findOne({ username })
        .populate('following', 'name username image')
        .populate('followers', 'name username image');
    } catch (e) {
      return null;
    }
  }

  async findUserByIdUnsafe(id: string): Promise<UserDocument | null> {
    try {
      return await User.findById(id, '+password');
    } catch (e) {
      return null;
    }
  }

  async findUserByUsernameUnsafe(username: string): Promise<UserDocument | null> {
    try {
      return await User.findOne({ username }, '+password');
    } catch (e) {
      return null;
    }
  }

  async findUserByEmailUnsafe(email: string): Promise<UserDocument | null> {
    try {
      return await User.findOne({ email }, '+password');
    } catch (e) {
      return null;
    }
  }

  async findUserByUsernameOrEmailUnsafe(
    username: string,
    email: string,
  ): Promise<UserDocument | null> {
    try {
      return await User.findOne().or([{ username }, { email }]);
    } catch (e) {
      return null;
    }
  }
}

export default UserRepository;
