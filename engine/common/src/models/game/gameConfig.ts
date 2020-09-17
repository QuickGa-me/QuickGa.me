export interface GameConfig {
  adRunInterval: 'EveryGame' | 'Every15Minutes';
  lobbyRules: {
    minPlayers: number;
    maxPlayers: number;
  };
}
