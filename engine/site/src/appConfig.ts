export class AppConfig {
  static env: 'local' | 'prod' = process.env.REACT_APP_ENV as 'local' | 'prod';
  static get host() {
    switch (this.env) {
      case 'local':
        return 'https://localhost:3503';
      case 'prod':
        return 'https://api.bounceblock.party';
    }
  }
  static get socketHost() {
    switch (this.env) {
      case 'local':
        return 'ws://localhost:3001';
      case 'prod':
        return 'wss://ws.bounceblock.party';
    }
  }
}
