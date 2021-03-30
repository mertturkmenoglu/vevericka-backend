declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: string;
    PORT: string;
    MONGU_URI: string;
    JWT_SECRET: string;
  }
}