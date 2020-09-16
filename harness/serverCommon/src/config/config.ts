export class Config {
  static get env(): 'LOCAL' {
    return 'LOCAL';
  }
  static get playerJwtKey(): string {
    return 'abc123';
  }
  static get mongoConnectionString(): string {
    return 'mongodb://qg:qg@mongo:27017/quickgame-harness';
  }
  static get mongoDbName(): string {
    return 'quickgame-harness';
  }
  static get redisHost(): string {
    return 'redis';
  }
}
