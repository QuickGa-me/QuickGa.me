import {ServerSocket} from './serverSocket';
import {
  PubSubGameScriptUpdatedRequest,
  PubSubGameScriptUpdatedResponse,
  PubSubStartGameRequest,
  PubSubStartGameResponse,
} from '@serverCommon/models/pubsubModels';
import {PubSubService} from '@serverCommon/services/pubSubService';
import {Utils} from '@common/utils';
import axios from 'axios';
// import safeEval from 'safe-eval';

async function main() {
  console.log('start shoes');
  console.log('connecting redis');
  const PubSubGameScript = new PubSubService();
  await PubSubGameScript.start();

  let gameScript = '';

  PubSubGameScript.blockingPop<PubSubGameScriptUpdatedRequest>('game-script', async (result) => {
    console.log('got new game script');

    const response = await axios({
      url: 'http://host.docker.internal:44442/bundle.js',
      method: 'GET',
      responseType: 'text',
    });
    // console.log(response.data);
    console.log('downloaded ', response.data.length);
    gameScript = response.data;
    // tslint:disable-next-line:no-eval
    eval(response.data);

    PubSubGameScript.push<PubSubGameScriptUpdatedResponse>(result.responseId, {
      messageId: result.messageId,
    });
  });

  /*
  PubSubService.blockingPop<PubSubStartGameRequest>('new-game', async (result) => {
    console.log('creating new game');
    /!*
    const dbLiveGame = await DBLiveGame.db.getById(liveGameId);
    const dbGame = await DBGame.db.getById(dbLiveGame.gameId);
    let serverCode = eval(dbGame.serverSource!);
    let game: Game = {
      gameServerAddress: Config.env === 'DEV' ? `ws://localhost:${this.port}` : 'wss://game.quickga.me',
      dbGame: dbGame,
      gameId: dbGame._id.toHexString(),
      liveGameId: liveGameId,
      started: false,
      users: await Promise.all(
          dbLiveGame.users.map(async u => ({
            user: DBUser.toUserModel(await DBUser.db.getById(u.id)),
            connected: false,
            joined: false
          }))
      ),
      server: new serverCode['default']({logicTickInterval: -1})
    };
    dbLiveGame.gameServerAddress = game.gameServerAddress;
    await DBLiveGame.db.updateDocument(dbLiveGame);
    this.games.push(game);
    console.log('game created');*!/

    /!*console.log('sending new game back to lobby ', result.lobbyId);
    PubSubService.push<PubSubStartGameResponse>(result.lobbyId, {
      messageId: result.messageId,
      gameUrl: newGame.gameUrl,
    });*!/
  });
*/

  const serverSocket = new ServerSocket();
  serverSocket.start({onJoin: () => {}, onLeave: () => {}, onMessage: () => {}});
  console.log('setup');
}

main()
  .then(() => {})
  .catch(async (ex: Error) => {
    console.error(ex);
  });
