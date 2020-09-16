import {HttpPlayerModel} from '../httpPlayerModel';
import {GameRules} from '../../dbModels/dbGame';

export interface HttpLobbyDetails {
  lobbyId: string;
  gameId: string;
  lobbyCode: string;
  gameRules: GameRules;
}
