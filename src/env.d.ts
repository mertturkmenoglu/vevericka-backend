declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: string;
    JWT_SECRET: string;
    SENDGRID_API_KEY: string;
    REDIS_URL: string;
    DATABASE_URL: string;
    PORT: string;
    CONTENTFUL_SPACE_ID: string;
    CONTENTFUL_ENVIRONMENT: string;
    CONTENTFUL_ACCESS_TOKEN: string;
    CLOUDFLARE_IMAGES_API_TOKEN: string;
    CLOUDFLARE_IMAGES_ACCOUNT_ID: string;
    CLOUDFLARE_IMAGES_IMAGE_DELIVERY_BASE_URL: string;
    CLOUDFLARE_IMAGES_API_BASE_URL: string;
    BETA_REGISTER_CODE: string;
    ALGOLIA_APPLICATION_ID: string;
    ALGOLIA_ADMIN_KEY: string;
  }
}
