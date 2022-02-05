import { Module } from '@nestjs/common';
import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [AssetController],
  providers: [AssetService],
})
// eslint-disable-next-line prettier/prettier
export class AssetModule { }
