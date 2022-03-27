import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { IUploadLinkResponse } from './models/upload-link-response.model';

@Injectable()
export class AssetService {
  private readonly API_BASE_URL = process.env.CLOUDFLARE_IMAGES_API_BASE_URL;
  private readonly API_TOKEN = process.env.CLOUDFLARE_IMAGES_API_TOKEN;

  constructor(private readonly http: HttpService) {}

  async getUploadLink(): Promise<IUploadLinkResponse | null> {
    const url = `${this.API_BASE_URL}/direct_upload`;

    try {
      const observable = this.http.post<IUploadLinkResponse>(
        url,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.API_TOKEN}`,
          },
        },
      );
      const response = await firstValueFrom(observable);
      return response.data;
    } catch (e) {
      return null;
    }
  }
}
