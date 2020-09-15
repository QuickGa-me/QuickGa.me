import {Config} from './config';
import {RedisClient, createClient} from 'redis';
import {Utils} from '@common/utils';

export interface WaitMessage {
    messageId: string;
}

export class PubSub {
    private static pushClient: RedisClient;
    private static popClient: RedisClient;
    private static mainPopClient: RedisClient;
    public static id: string;

    static async start() {
        this.pushClient = createClient(Config.redis.port, Config.redis.ip);
        this.popClient = createClient(Config.redis.port, Config.redis.ip);
        this.mainPopClient = createClient(Config.redis.port, Config.redis.ip);
        this.id = Utils.guid();
        await Promise.all([
            new Promise((res, rej) => {
                this.pushClient.on('ready', () => {
                    console.log('push ready');
                    res();
                });
                this.pushClient.on('error', er => {
                    console.error('push', er);
                    rej();
                });
            }),
            new Promise((res, rej) => {
                this.popClient.on('ready', () => {
                    console.log('pop ready');
                    res();
                });
                this.popClient.on('error', er => {
                    console.error('pop', er);
                    rej();
                });
            }),
            new Promise((res, rej) => {
                this.mainPopClient.on('ready', () => {
                    console.log('main pop ready');
                    res();
                });
                this.mainPopClient.on('error', er => {
                    console.error('main pop', er);
                    rej();
                });
            })
        ]);

        this.mainBlockingPop();
    }

    static push<T>(channel: string, payload: T) {
        this.pushClient.rpush(channel, JSON.stringify(payload));
    }

    static pushTests: {test: (res: WaitMessage) => boolean; resolve: (value: any) => void}[] = [];

    static pushAndWait<TReq extends WaitMessage, TRes extends WaitMessage>(
        channel: string,
        payload: TReq
    ): Promise<TRes> {
        return new Promise(res => {
            this.pushClient.rpush(channel, JSON.stringify(payload));
            let tester = {
                test: (message: WaitMessage) => message.messageId == payload.messageId,
                resolve: (response: TRes) => {
                    this.pushTests.splice(this.pushTests.indexOf(tester as any), 1);
                    res(response);
                }
            };
            this.pushTests.push(tester as any);
        });
    }

    static blockingPop<T>(channel: string, callback: (result: T) => void): void {
        let blpop = (cb: (result: string) => void) => {
            this.popClient.blpop(channel, 0, (caller, payload) => {
                cb(payload[1]);
                blpop(cb);
            });
        };
        blpop(result => {
            callback(JSON.parse(result) as T);
        });
    }

    static mainBlockingPop(): void {
        let blpop = (cb: (result: string) => void) => {
            this.mainPopClient.blpop(this.id, 0, (caller, payload) => {
                cb(payload[1]);
                blpop(cb);
            });
        };
        blpop(result => {
            for (let test of this.pushTests) {
                if (test.test(JSON.parse(result) as WaitMessage)) {
                    test.resolve(JSON.parse(result));
                    return;
                }
            }
        });
    }
}
