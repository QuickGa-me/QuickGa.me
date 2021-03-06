import {ServerSocket} from './serverSocket';
import {ServerUtils} from './serverUtils';
import {PubSubStartGameRequest, PubSubStartGameResponse} from '@serverCommon/models/pubsubModels';
import {PubSubService} from '@serverCommon/services/pubSubService';

async function main() {
  await ServerUtils.updateLoadBalancer('abc' + (Math.random() * 10000).toFixed());

  PubSubService.blockingPop<PubSubStartGameRequest>('new-game', async (result) => {
    console.log('creating new game');
    /*
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
    console.log('game created');*/

    console.log('sending new game back to lobby ', result.lobbyId);
    PubSub.push<PubSubStartGameResponse>(result.lobbyId, {
      messageId: result.messageId,
      gameUrl: newGame.gameUrl,
    });
  });

  const serverSocket = new ServerSocket();
  serverSocket.start({onJoin: () => {}, onLeave: () => {}, onMessage: () => {}});
  console.log('setup');
}

main()
  .then(() => {})
  .catch(async (ex: Error) => {
    console.error(ex);
  });
