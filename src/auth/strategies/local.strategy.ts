import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Auth } from '../auth.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<Auth> {
    const user = await this.authService.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const match = await this.authService.doPasswordsMatch(password, user.password);

    if (!match) {
      throw new UnauthorizedException();
    }

    return user;
  }
}