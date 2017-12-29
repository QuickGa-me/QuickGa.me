export class Config {
    static env: 'DEV' | 'PROD' = 'DEV';

    static websocketUrl = (jwt: string) => {
        return Config.env == 'DEV' ? `ws://localhost:7898?jwt=${jwt}` : `wss://lobby.quickga.me?jwt=${jwt}`;
    };
    static apiUrl = Config.env == 'DEV' ? 'http://localhost:3000' : 'https://web.quickga.me';
}
