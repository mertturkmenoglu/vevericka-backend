import crypto from 'crypto';

import sgMail from '@sendgrid/mail';
import { Service } from 'typedi';

import { UserDocument } from '../../../../models/User';
import UserRepository from '../user/UserRepository';

@Service()
class AuthService {
  constructor(private readonly repository: UserRepository) { }

  async createUser(user: UserDocument): Promise<UserDocument | null> {
    return this.repository.insertUser(user);
  }

  async getUserByEmail(email: string): Promise<UserDocument | null> {
    return this.repository.findUserByEmailUnsafe(email);
  }

  async userExists(username: string, email: string): Promise<Boolean> {
    const user = await this.repository.findUserByUsernameOrEmailUnsafe(username, email);
    return !(user === null);
  }

  // eslint-disable-next-line class-methods-use-this
  generatePasswordResetCode() {
    return crypto.randomBytes(4).toString('hex');
  }

  // eslint-disable-next-line class-methods-use-this
  async sendPasswordResetEmail(email: string, passwordResetCode: string): Promise<Boolean> {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

    const emailMsg = {
      to: email,
      from: 'contactvevericka@gmail.com',
      subject: 'Vevericka Password Reset Code',
      text: 'Vevericka Auth Service Password Reset Code',
      html: `Your one time password reset code is <strong>${passwordResetCode}</strong>. If you have a problem, please contact with Vevericka Support Team.`,
    };

    try {
      await sgMail.send(emailMsg);
      return true;
    } catch (e) {
      return false;
    }
  }
}

export default AuthService;
