export class AppConfig {
  static env: 'local' | 'prod' = process.env.REACT_APP_ENV as 'local' | 'prod';
  static get host() {
    switch (this.env) {
      case 'local':
        return 'http://localhost:3503';
      case 'prod':
        return 'https://api.quickga.me';
    }
  }
  static get lobbyHost() {
    switch (this.env) {
      case 'local':
        return 'ws://localhost:3939';
      case 'prod':
        return 'wss://lobby.quickga.me';
    }
  }
}
