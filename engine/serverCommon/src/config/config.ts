import {SecureConfig} from './secureConfig';

export class Config {
  static get env(): 'LOCAL' | 'DEV' | 'PROD' {
    return SecureConfig.getKey('ENV') as 'LOCAL' | 'DEV' | 'PROD';
  }
  static get isConsole() {
    return !!process.env.IS_CONSOLE;
  }
  static get isOffline() {
    return !!process.env.IS_OFFLINE;
  }
  static get playerJwtKey(): string {
    return SecureConfig.getKey('PLAYER_JWTKEY');
  }
  static get mongoConnectionString(): string {
    return SecureConfig.getKey('MONGO_CONNECTIONSTRING');
  }
  static get mongoDbName(): string {
    return SecureConfig.getKey('MONGO_DBNAME');
  }
  static get redisHost(): string {
    return SecureConfig.getKey('REDIS_HOST');
  }
}
