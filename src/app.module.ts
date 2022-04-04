import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { ExploreModule } from './explore/explore.module';
import { PostModule } from './post/post.module';
import { BlogModule } from './blog/blog.module';
import { AssetModule } from './asset/asset.module';
import { AlgoliaModule } from './algolia/algolia.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
    BlogModule,
    AssetModule,
    AlgoliaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
