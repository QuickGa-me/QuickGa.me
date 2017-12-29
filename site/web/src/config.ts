export class Config {
    static env: 'DEV' | 'PROD' = 'PROD';
    static websocketUrl = Config.env == 'DEV' ? 'ws://localhost:7898' : 'wss://lobby.quickga.me';
    static apiUrl = Config.env == 'DEV' ? 'http://localhost:3000' : 'https://web.quickga.me';
}