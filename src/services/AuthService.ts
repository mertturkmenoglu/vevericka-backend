import crypto from 'crypto';

import sgMail from '@sendgrid/mail';
import { Service } from 'typedi';
import UserRepository from '../api/v2/modules/user/UserRepository';
import { UserDocument } from '../models/User';

@Service()
class AuthService {
  constructor(private readonly repository: UserRepository) {}

  async getUserByEmail(email: string): Promise<UserDocument | null> {
    return this.repository.findUserByEmailUnsafe(email);
  }

  async userExists(username: string, email: string): Promise<Boolean> {
    const user = await this.repository.findUserByUsernameOrEmailUnsafe(username, email);
    return !(user === null);
  }

  generatePasswordResetCode = () => crypto.randomBytes(4).toString('hex');

  sendPasswordResetEmail = async (email: string, passwordResetCode: string): Promise<Boolean> => {
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
  };
}

export default AuthService;
