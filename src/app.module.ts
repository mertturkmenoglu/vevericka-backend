import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { ExploreModule } from './explore/explore.module';
import { Auth } from './auth/auth.entity';
import { Tag } from './explore/tag.entity';
import { SpeakingLanguage } from './user/speaking-language.entity';
import { WishToSpeakLanguage } from './user/wish-to-speak-language.entity';
import { Hobby } from './user/hobby.entity';
import { Location } from './user/location.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [User, Auth, Tag, SpeakingLanguage, WishToSpeakLanguage, Hobby, Location],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    BookmarkModule,
    ExploreModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
