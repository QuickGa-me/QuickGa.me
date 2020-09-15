import {HttpPlayerModel} from '../httpPlayerModel';
import {GameRules} from '../../dbModels/dbGame';

export interface HttpLobbyDetails {
  lobbyId: string;
  gameId: string;
  gameRules: GameRules;
}
