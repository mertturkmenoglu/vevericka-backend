import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { ExploreModule } from './explore/explore.module';
import { PostModule } from './post/post.module';
import { BlogModule } from './blog/blog.module';
import { AssetModule } from './asset/asset.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ShortModule } from './short/short.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: process.env.NODE_ENV === 'production' ? 120 : 300,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 30, // seconds
      max: 50, // maximum number of items in cache
    }),
    AuthModule,
    UserModule,
    BookmarkModule,
    ExploreModule,
    PostModule,
    BlogModule,
    AssetModule,
    ShortModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
