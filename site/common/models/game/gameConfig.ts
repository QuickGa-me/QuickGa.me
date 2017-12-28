export interface GameConfig {
    hasLobby: boolean;
    adRunInterval: 'EveryGame' | 'Every15Minutes';
    lobbyRules: {
        minPlayers: number;
        maxPlayers: number;
        waitSecondsForPlayers: number;
    }
}