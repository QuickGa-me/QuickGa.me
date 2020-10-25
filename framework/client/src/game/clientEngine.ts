import {
  assertType,
  Discriminate,
  Engine,
  Entity,
  Game,
  GameConstants,
  objectSafeKeys,
  Scheduler,
  unreachable,
} from '@quickga.me/framework.common';
import {ExtrapolateStrategy} from './synchronizer';
import {IClientSocket} from '../socket';

const STEP_DELAY_MSEC = 12; // if forward drift detected, delay next execution by this amount
const STEP_HURRY_MSEC = 8; // if backward drift detected, hurry next execution by this amount
const TIME_RESET_THRESHOLD = 100;

export declare type CTOSJoin = {
  type: 'join';
};
export declare type CTOSPing = {
  ping: number;
  type: 'ping';
};
export declare type CTOSPlayerInput<PlayerInputKeys extends string> = {
  keys: {
    [key in PlayerInputKeys]: boolean;
  };
  messageIndex: number;
  step: number;
  type: 'playerInput';
};
export declare type STOCJoined = {
  playerEntityId: number;
  serverVersion: number;
  stepCount: number;
  type: 'joined';
};
export declare type STOCPong = {
  type: 'pong';
  ping: number;
};
export declare type BaseEngineConfig<
  STOC extends {type: string},
  CTOS extends {type: string},
  PlayerInputKeys extends string
> = {
  ServerToClientMessage: STOCJoined | STOCPong | STOC;
  ClientToServerMessage: CTOSJoin | CTOSPing | CTOSPlayerInput<PlayerInputKeys> | CTOS;
  PlayerInputKeys: PlayerInputKeys;
};

export type ClientGameOptions<
  STOC extends {type: string},
  CTOS extends {type: string},
  PlayerInputKeys extends string,
  EngineConfig extends BaseEngineConfig<STOC, CTOS, PlayerInputKeys>
> = {
  onDisconnect: (me: ClientEngine<STOC, CTOS, PlayerInputKeys, EngineConfig>) => void;
  onJoin: (me: ClientEngine<STOC, CTOS, PlayerInputKeys, EngineConfig>) => void;
};

export class ClientEngine<
  STOC extends {type: string},
  CTOS extends {type: string},
  PlayerInputKeys extends string,
  EngineConfig extends BaseEngineConfig<STOC, CTOS, PlayerInputKeys>
> extends Engine<STOC, CTOS, PlayerInputKeys, EngineConfig> {
  debugValues: {[key: string]: number | string} = {};
  isDead: boolean = false;
  keys: {[key in EngineConfig['PlayerInputKeys']]: boolean} = this.initialKeys();
  latency: number = 0;
  pingIndex = 0;
  pings: {[pingIndex: number]: number} = {};
  spectatorMode: boolean = false;

  private connected = false;
  private correction: number = 0;
  private doReset: boolean = false;
  private lastStepTime: number = 0;
  private messageIndex: number = 1;
  private messagesToProcess: EngineConfig['ServerToClientMessage'][] = [];
  private scheduler?: Scheduler;
  private synchronizer: ExtrapolateStrategy;
  private totalPlayers: number = 0;

  constructor(
    private serverPath: string,
    public options: ClientGameOptions<STOC, CTOS, PlayerInputKeys, EngineConfig>,
    public socket: IClientSocket,
    public game: Game<STOC, CTOS, PlayerInputKeys, EngineConfig>
  ) {
    super();
    game.setEngine(this);
    this.synchronizer = new ExtrapolateStrategy(this);
    this.connect();
  }

  assignActor(entity: Entity): void {
    //todo pass in config
    // entity.actor = new ActorEntityTypes[entity.type](this, entity as any);
  }

  checkDrift(checkType: 'onServerSync' | 'onEveryStep') {
    if (!this.game.highestServerStep) return;

    const thresholds = this.synchronizer.STEP_DRIFT_THRESHOLDS;
    const maxLead = thresholds[checkType].MAX_LEAD;
    const maxLag = thresholds[checkType].MAX_LAG;
    const clientStep = this.game.stepCount;
    const serverStep = this.game.highestServerStep;
    if (clientStep > serverStep + maxLead) {
      console.warn(
        `step drift ${checkType}. [${clientStep} > ${serverStep} + ${maxLead}] Client is ahead of server.  Delaying next step.`
      );
      if (this.scheduler) this.scheduler.delayTick();
      this.lastStepTime += STEP_DELAY_MSEC;
      this.correction += STEP_DELAY_MSEC;
    } else if (serverStep > clientStep + maxLag) {
      console.warn(
        `step drift ${checkType}. [${serverStep} > ${clientStep} + ${maxLag}] Client is behind server.  Hurrying next step.`
      );
      if (this.scheduler) this.scheduler.hurryTick();
      this.lastStepTime -= STEP_HURRY_MSEC;
      this.correction -= STEP_HURRY_MSEC;
    }
  }

  clearDebug(key: string) {
    delete this.debugValues[key];
  }

  clientStep = () => {
    if (!this.socket.isConnected()) return;
    const t = +new Date();
    const p = 1000 / 60;
    let dt = 0;
    // reset step time if we passed a threshold
    if (this.doReset || t > this.lastStepTime + TIME_RESET_THRESHOLD) {
      this.doReset = false;
      this.lastStepTime = t - p / 2;
      this.correction = p / 2;
    }

    // catch-up missed steps
    while (t > this.lastStepTime + p) {
      this.step(this.lastStepTime + p, p + this.correction, false);
      this.lastStepTime += p;
      this.correction = 0;
    }

    // if not ready for a real step yet, return
    // this might happen after catch up above
    if (t < this.lastStepTime) {
      dt = t - this.lastStepTime + this.correction;
      if (dt < 0) dt = 0;
      this.correction = this.lastStepTime - t;
      this.step(t, dt, true);
      return;
    }

    // render-controlled step
    dt = t - this.lastStepTime + this.correction;
    this.lastStepTime += p;
    this.correction = this.lastStepTime - t;
    this.step(t, dt, false);
  };

  connect() {
    this.connected = true;
    this.socket.connect(this.serverPath, {
      onOpen: () => {
        this.sendMessageToServer({type: 'join'});
      },
      onDisconnect: () => {
        this.options.onDisconnect(this);
        this.scheduler?.stop();
        this.connected = false;
      },
      onMessage: (messages) => {
        this.messagesToProcess.push(...messages);
      },
    });

    this.init();
  }

  disconnect() {
    this.socket.disconnect();
  }

  init() {
    this.scheduler = new Scheduler({
      period: 1000 / 60,
      tick: this.clientStep,
      delay: STEP_DELAY_MSEC,
    });
    this.scheduler!.start();

    const pingInterval = setInterval(() => {
      if (!this.connected) {
        clearInterval(pingInterval);
        return;
      }
      this.pingIndex++;
      this.pings[this.pingIndex] = +new Date();
      if (this.socket.isConnected()) this.socket.sendMessage({type: 'ping', ping: this.pingIndex});
    }, GameConstants.pingInterval);
  }

  joinGame() {
    this.sendMessageToServer({type: 'join'});
  }

  sendMessageToServer(message: EngineConfig['ClientToServerMessage']) {
    this.socket.sendMessage(message);
  }

  setDebug(key: string, value: number | string) {
    this.debugValues[key] = value;
  }

  setKey(input: EngineConfig['PlayerInputKeys'], value: boolean) {
    this.keys[input] = value;
  }

  setOptions(options: ClientGameOptions<STOC, CTOS, PlayerInputKeys, EngineConfig>) {
    this.options = options;
  }

  step = (t: number, dt: number, physicsOnly: boolean) => {
    // physics only case
    if (physicsOnly) {
      this.game.step(false, dt, true);
      return;
    }
    this.handleKeys();

    this.processMessages();

    // check for server/client step drift without update
    this.checkDrift('onEveryStep');

    this.game.step(false, dt, false);
    this.synchronizer.syncStep({dt});
    for (const entity of this.game.entities.array) {
      if (entity.markToDestroy) {
        entity.actor?.destroyClient();
      }
    }
  };

  handleKeys() {
    const keys = {...this.keys};
    let isMoving = false;
    for (const k of objectSafeKeys(keys)) {
      if (keys[k]) {
        isMoving = true;
        break;
      }
    }
    if (!isMoving) return;
    const inputEvent: CTOSPlayerInput<PlayerInputKeys> = {
      type: 'playerInput',
      messageIndex: this.messageIndex,
      step: this.game.stepCount,
      keys,
    };
    this.synchronizer.clientInputSave(inputEvent);
    this.game.processInput(inputEvent, this.game.clientPlayerId!);
    this.sendMessageToServer(inputEvent);
    this.messageIndex++;
  }

  private processMessages() {
    for (const message of this.messagesToProcess) {
      switch (message.type) {
        case 'pong':
          /*          ugh okay you need to separate the engine messages and user messages somehow
          also make bespoke messages harder, most verything happens trhoguh worldstate sync
          you hate these generics*/
          assertType<Discriminate<EngineConfig['ServerToClientMessage'], 'type', 'pong'>>(message);
        /*   if (!(message.ping in this.pings)) {
            throw new Error('Unmatched ping.');
          }
          const time = this.pings[message.ping];
          this.latency = +new Date() - time - GameConstants.serverTickRate;
          delete this.pings[message.ping];
          break;*/
        /*
        case 'worldState':
          this.totalPlayers = message.totalPlayers;

          if (!this.game.highestServerStep || message.stepCount > this.game.highestServerStep)
            this.game.highestServerStep = message.stepCount;

          this.processSync(message);

          this.checkDrift('onServerSync');
          break;
*/
        default:
          // unreachable(message);
          break;
      }
    }
    this.messagesToProcess.length = 0;
  }

  /*
  private processSync(message: STOCWorldState) {
    this.synchronizer.collectSync(message);

    if (message.stepCount > this.game.stepCount + this.synchronizer.STEP_DRIFT_THRESHOLDS.clientReset) {
      console.log(
        `========== world step count updated from ${this.game.stepCount} to  ${message.stepCount} ==========`
      );
      this.doReset = true;
      this.game.stepCount = message.stepCount;
    }
  }
*/

  private initialKeys(): {[key in EngineConfig['PlayerInputKeys']]: boolean} {
    return undefined as any;
  }
}

export type GameTypeConfiguration<TPlayerInputKeys extends {[key: string]: boolean}> = {
  playerInputKeys: TPlayerInputKeys;
};
