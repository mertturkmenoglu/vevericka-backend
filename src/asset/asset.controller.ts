import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { ApiConsumes, ApiOkResponse, ApiProduces, ApiTags } from '@nestjs/swagger';
import { AssetService } from './asset.service';
import { IUploadLink } from './models/upload-link.model';

@ApiTags('asset')
@ApiConsumes('application/json')
@ApiProduces('application/json')
@Controller({
  version: '3',
  path: 'asset',
})
export class AssetController {
  // eslint-disable-next-line prettier/prettier
  constructor(
    private assetService: AssetService
  ) { }

  @Get('/image/upload-link')
  @ApiOkResponse({
    description: 'Get direct creator upload link',
  })
  async getUploadLink(): Promise<IUploadLink> {
    console.log('getUploadLink called');
    const uploadLink = await this.assetService.getUploadLink();

    if (uploadLink === null) {
      throw new InternalServerErrorException('Get upload link failed');
    }

    return {
      url: uploadLink.result.uploadURL,
    };
  }
}
