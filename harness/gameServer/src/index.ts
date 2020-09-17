import {ServerSocket} from './serverSocket';
import {
  PubSubGameScriptUpdatedRequest,
  PubSubGameScriptUpdatedResponse,
  PubSubNewGameRequest,
  PubSubNewGameResponse,
} from '@serverCommon/models/pubsubModels';
import {PubSubService} from '@serverCommon/services/pubSubService';
import {Utils} from '@common/utils';
import axios from 'axios';
import * as vm from 'vm';
import {RunningScriptOptions} from 'vm';
import {QGServer} from '@framework/index';

async function main() {
  console.log('start shoes');
  console.log('connecting redis');
  const PubSubGameScript = new PubSubService();
  await PubSubGameScript.start();

  const PubSubNewGame = new PubSubService();
  await PubSubNewGame.start();

  let gameScript = '';

  PubSubGameScript.blockingPop<PubSubGameScriptUpdatedRequest>('game-script', async (result) => {
    try {
      console.log('got new game script');

      const response = await axios({
        url: 'http://host.docker.internal:44442/bundle.js',
        method: 'GET',
        responseType: 'text',
      });
      console.log('downloaded ', response.data.length);
      gameScript = response.data;

      console.log('eval');

      const serverCode = safeEval(gameScript, {}, {});
      const code = new serverCode.default();
      console.log(code.onTick(12));

      PubSubGameScript.push<PubSubGameScriptUpdatedResponse>(result.responseId, {
        messageId: result.messageId,
      });
    } catch (ex) {
      console.error('FATAL', ex);
    }
  });
  const currentGame: {
    current?: {
      started: boolean;
      active: boolean;
      numberOfPlayersTotal: number;
      numberOfPlayerJoined: number;
      game: QGServer;
    };
  } = {current: undefined};

  PubSubNewGame.blockingPop<PubSubNewGameRequest>('new-game', async (result) => {
    console.log('creating new game');
    if (!gameScript) {
      PubSubNewGame.push<PubSubNewGameResponse>(result.responseId, {
        messageId: result.messageId,
        error: undefined,
      });
      return;
    }
    const serverCode = safeEval(gameScript, {}, {});
    const code = new serverCode.default();
    console.log(code.onTick(12));
    currentGame.current = {
      started: false,
      active: true,
      game: code,
      numberOfPlayerJoined: 0,
      numberOfPlayersTotal: result.numberOfPlayers,
    };
    console.log(currentGame.current);
    PubSubNewGame.push<PubSubNewGameResponse>(result.responseId, {
      messageId: result.messageId,
      error: undefined,
    });
  });

  const serverSocket = new ServerSocket();
  serverSocket.start({
    onJoin: (connectionId) => {
      console.log('on join', connectionId, currentGame.current);
      if (!currentGame.current) {
        console.log('NO GAME LOADED');
        serverSocket.disconnect(connectionId);
        return;
      }
      console.log('user joined');
      currentGame.current.numberOfPlayerJoined++;
      if (currentGame.current.numberOfPlayerJoined === currentGame.current.numberOfPlayersTotal) {
        currentGame.current.started = true;

        console.log('GAME STARTED', currentGame.current);
      }
    },
    onLeave: (connectionId) => {
      console.log('on leave', connectionId, currentGame.current);
      if (!currentGame.current) {
        return;
      }
      currentGame.current.numberOfPlayerJoined--;
      if (currentGame.current.started) {
        // send to game
      }
    },
    onMessage: (connectionId) => {
      console.log('user messaged');
    },
  });
  console.log('setup');
}

main()
  .then(() => {})
  .catch(async (ex: Error) => {
    console.error(ex);
  });

function safeEval(code: string, context: {[key: string]: any}, opts: RunningScriptOptions) {
  const sandbox: {[key: string]: any} = {};
  const resultKey = 'SAFE_EVAL_' + Math.floor(Math.random() * 1000000);
  sandbox[resultKey] = {};
  const clearContext = `
    (function(){
      Function = undefined;
      const keys = Object.getOwnPropertyNames(this).concat(['constructor']);
      keys.forEach((key) => {
        const item = this[key];
        if(!item || typeof item.constructor !== 'function') return;
        this[key].constructor = undefined;
      });
    })();
  `;
  code = clearContext + resultKey + '=' + code;
  if (context) {
    Object.keys(context).forEach((key) => {
      sandbox[key] = context[key];
    });
  }
  vm.runInNewContext(code, sandbox, opts);
  return sandbox[resultKey];
}
