export class Config {
  static get env(): 'LOCAL' {
    return 'LOCAL';
  }
  static get playerJwtKey(): string {
    return 'abc123';
  }
  static get mongoConnectionString(): string {
    return 'mongodb://localhost:27017/?connectTimeoutMS=10000';
  }
  static get mongoDbName(): string {
    return 'quickgame-harness';
  }
  static get redisHost(): string {
    return '127.0.0.1';
  }
}
