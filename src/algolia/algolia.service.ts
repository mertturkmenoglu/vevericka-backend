import { Injectable } from '@nestjs/common';
import algoliasearch, { SearchClient, SearchIndex } from 'algoliasearch';
import { AlgoliaUser } from './types/algolia-user.type';

@Injectable()
export class AlgoliaService {
  private readonly algoliaSearchClient: SearchClient;
  private readonly algoliaUserIndex: SearchIndex;
  private readonly ALGOLIA_USER_INDEX_KEY = 'USER';

  constructor() {
    this.algoliaSearchClient = algoliasearch(
      process.env.ALGOLIA_APPLICATION_ID,
      process.env.ALGOLIA_ADMIN_KEY,
    );

    this.algoliaUserIndex = this.algoliaSearchClient.initIndex(this.ALGOLIA_USER_INDEX_KEY);
  }

  async saveUser(user: AlgoliaUser): Promise<boolean> {
    const { id, ...rest } = user;
    try {
      await this.algoliaUserIndex.saveObject({
        objectID: id,
        ...rest,
      });
      return true;
    } catch (e) {
      return false;
    }
  }
}
