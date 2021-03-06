import {RedisClient, createClient} from 'redis';
import {Utils} from '@common/utils';
import {Config} from '../config/config';

export interface WaitMessage {
  messageId: string;
}

export class PubSubService {
  private pushClient?: RedisClient;
  private popClient?: RedisClient;
  private mainPopClient?: RedisClient;
  id: string = Utils.guid();

  async start() {
    try {
      if (this.pushClient) return;

      this.pushClient = createClient(6379, Config.redisHost);
      this.popClient = createClient(6379, Config.redisHost);
      this.mainPopClient = createClient(6379, Config.redisHost);
      await Promise.all([
        new Promise((res, rej) => {
          this.pushClient!.on('ready', () => {
            console.log('push ready');
            res();
          });
          this.pushClient!.on('error', (er) => {
            console.error('push', er);
            rej();
          });
        }),
        new Promise((res, rej) => {
          this.popClient!.on('ready', () => {
            console.log('pop ready');
            res();
          });
          this.popClient!.on('error', (er) => {
            console.error('pop', er);
            rej();
          });
        }),
        new Promise((res, rej) => {
          this.mainPopClient!.on('ready', () => {
            console.log('main pop ready');
            res();
          });
          this.mainPopClient!.on('error', (er) => {
            console.error('main pop', er);
            rej();
          });
        }),
      ]);

      this.mainBlockingPop();
    } catch (ex) {
      console.error('REDIS', ex);
    }
  }

  push<T>(channel: string, payload: T) {
    this.pushClient?.rpush(channel, JSON.stringify(payload));
  }

  pushTests: {test: (res: WaitMessage) => boolean; resolve: (value: any) => void}[] = [];

  pushAndWait<TReq extends WaitMessage, TRes extends WaitMessage>(channel: string, payload: TReq): Promise<TRes> {
    return new Promise((res) => {
      this.pushClient?.rpush(channel, JSON.stringify(payload));
      const tester = {
        test: (message: WaitMessage) => message.messageId === payload.messageId,
        resolve: (response: TRes) => {
          this.pushTests.splice(this.pushTests.indexOf(tester as any), 1);
          res(response);
        },
      };
      this.pushTests.push(tester as any);
    });
  }

  blockingPop<T>(channel: string, callback: (result: T) => void): void {
    const blpop = (cb: (result: string) => void) => {
      console.log('blocking pop', channel);
      this.popClient?.blpop(channel, 0, (caller, payload) => {
        console.log('got blocking pop', channel);
        cb(payload[1]);
        blpop(cb);
      });
    };
    blpop((result) => {
      callback(JSON.parse(result) as T);
    });
  }

  mainBlockingPop(): void {
    const blpop = (cb: (result: string) => void) => {
      this.mainPopClient?.blpop(this.id!, 0, (caller, payload) => {
        cb(payload[1]);
        blpop(cb);
      });
    };
    blpop((result) => {
      for (const test of this.pushTests) {
        if (test.test(JSON.parse(result) as WaitMessage)) {
          test.resolve(JSON.parse(result));
          return;
        }
      }
    });
  }
}
