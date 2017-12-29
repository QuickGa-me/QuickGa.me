export interface GameConfig {
    hasLobby: boolean;
    adRunInterval: 'EveryGame' | 'Every15Minutes';
    maxGamesPerServer: number;
    lobbyRules: {
        minPlayers: number;
        maxPlayers: number;
        waitSecondsForPlayers: number;
    };
}
