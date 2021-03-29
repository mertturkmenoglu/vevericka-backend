import winston, { LoggerOptions } from 'winston';
import IS_PROD from '../helpers/isProd';

const options: LoggerOptions = {
  transports: [
    new winston.transports.Console({
      level: IS_PROD ? 'error' : 'debug',
    }),
    new winston.transports.File({ filename: 'debug.log', level: 'debug' }),
  ],
};

const logger = winston.createLogger(options);

if (!IS_PROD) {
  logger.debug('Logging at debug level');
}

export default logger;
