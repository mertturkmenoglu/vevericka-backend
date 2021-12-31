import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hobby } from './hobby.entity';
import { Location } from './location.entity';
import { SpeakingLanguage } from './speaking-language.entity';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';
import { WishToSpeakLanguage } from './wish-to-speak-language.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, SpeakingLanguage, WishToSpeakLanguage, Hobby, Location])],
  controllers: [UserController],
  providers: [UserService],
  exports: [TypeOrmModule]
})
export class UserModule { }
