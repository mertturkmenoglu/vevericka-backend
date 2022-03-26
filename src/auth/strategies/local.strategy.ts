import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Auth } from '@prisma/client';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<Auth> {
    const { data: user } = await this.authService.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const { data: match } = await this.authService.doPasswordsMatch(password, user.password);

    if (!match) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
