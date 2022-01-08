import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
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
import { PostModule } from './post/post.module';
import { Post } from './post/post.entity';

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
      entities: [User, Auth, Tag, SpeakingLanguage, WishToSpeakLanguage, Hobby, Location, Post],
      synchronize: true,
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    CacheModule.register(),
    AuthModule,
    UserModule,
    BookmarkModule,
    ExploreModule,
    PostModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
