import {createClient, RedisClient} from 'redis';
import {Config} from '../config/config';

export class RedisManager {
  static manager: RedisManager;
  private client?: RedisClient;
  private subscribeClient?: RedisClient;

  append(key: string, value: string): Promise<void> {
    return new Promise((res, rej) => {
      this.client?.append(key, value, (err, result) => {
        if (err) {
          rej(err);
          return;
        }
        res();
      });
    });
  }

  expire(key: string, duration: number): Promise<void> {
    return new Promise((res, rej) => {
      this.client?.expire(key, duration, (err, result) => {
        if (err) {
          rej(err);
          return;
        }
        res();
      });
    });
  }

  flushAll(): Promise<void> {
    return new Promise((res, rej) => {
      this.client?.flushall((err, result) => {
        if (err) {
          rej(err);
          return;
        }
        res();
      });
    });
  }

  get<T>(key: string, def?: T): Promise<T> {
    return new Promise((res, rej) => {
      this.client?.get(key, (err, result) => {
        if (err) {
          rej(err);
          return;
        }

        res(result ? (JSON.parse(result) as T) : def);
      });
    });
  }

  getString(key: string, def?: string): Promise<string> {
    return new Promise((res, rej) => {
      this.client?.get(key, (err, result) => {
        if (err) {
          rej(err);
          return;
        }

        res(result || def);
      });
    });
  }
  hdel<T>(key: string, field: string): Promise<void> {
    return new Promise((res, rej) => {
      this.client?.hdel(key, field, (err, result) => {
        if (err) {
          rej(err);
          return;
        }
        res();
      });
    });
  }
  hgetall<T>(key: string): Promise<T[]> {
    return new Promise((res, rej) => {
      this.client?.hgetall(key, (err, result) => {
        if (err) {
          rej(err);
          return;
        }
        if (!result) {
          return res([]);
        }
        res(Object.values(result).map((a) => JSON.parse(a) as T) ?? []);
      });
    });
  }
  hmget<T>(key: string, field: string): Promise<T | undefined> {
    return new Promise<T | undefined>((res, rej) => {
      this.client?.hmget(key, field, (err, result) => {
        if (err) {
          rej(err);
          return;
        }
        res(result[0] ? (JSON.parse(result[0]) as T) : undefined);
      });
    });
  }
  hkeys<T>(key: string): Promise<string[]> {
    return new Promise<string[]>((res, rej) => {
      this.client?.hkeys(key, (err, result) => {
        if (err) {
          rej(err);
          return;
        }
        res(result);
      });
    });
  }

  hset<T>(key: string, field: string, value: T): Promise<void> {
    return new Promise((res, rej) => {
      this.client?.hset(key, field, JSON.stringify(value), (err, result) => {
        if (err) {
          rej(err);
          return;
        }
        res();
      });
    });
  }

  hlen<T>(key: string): Promise<number> {
    return new Promise<number>((res, rej) => {
      this.client?.hlen(key, (err, result) => {
        if (err) {
          rej(err);
          return;
        }
        res(result);
      });
    });
  }
  del<T>(key: string): Promise<void> {
    return new Promise<void>((res, rej) => {
      this.client?.del(key, (err, result) => {
        if (err) {
          rej(err);
          return;
        }
        res();
      });
    });
  }

  incr(key: string) {
    return new Promise<number>((res, rej) => {
      this.client?.incr(key, (err, result) => {
        if (err) {
          rej(err);
          return;
        }

        res(result);
      });
    });
  }

  publish<T>(key: string, value: T): Promise<void> {
    return new Promise((res, rej) => {
      this.client?.publish(key, JSON.stringify(value), (err, result) => {
        if (err) {
          rej(err);
          return;
        }
        res();
      });
    });
  }

  rpush<T>(key: string, value: T): Promise<void> {
    return new Promise((res, rej) => {
      this.client?.rpush(key, JSON.stringify(value), (err, result) => {
        if (err) {
          rej(err);
          return;
        }
        res();
      });
    });
  }

  set<T>(key: string, value: T): Promise<void> {
    return new Promise((res, rej) => {
      this.client?.set(key, JSON.stringify(value), (err, result) => {
        if (err) {
          rej(err);
          return;
        }
        res();
      });
    });
  }

  setString(key: string, value: string): Promise<string> {
    return new Promise((res, rej) => {
      this.client?.set(key, value, (err, result) => {
        if (err) {
          rej(err);
          return;
        }
        res();
      });
    });
  }

  subscribe(key: string, callback: (result: string) => void): void {
    this.subscribeClient?.on('message', (channel, message) => {
      callback(message);
    });
    this.subscribeClient?.subscribe(key);
  }

  unsubscribe<T>(key: string): Promise<void> {
    return new Promise((res, rej) => {
      this.client?.unsubscribe(key, (err, result) => {
        if (err) {
          rej(err);
          return;
        }
        res();
      });
    });
  }

  static setup(): Promise<RedisManager> {
    return new Promise<RedisManager>((res, rej) => {
      if (RedisManager.manager) {
        if (RedisManager.manager.client?.connected) {
          res(RedisManager.manager);
          return;
        }
      }
      // console.time('connecting redis');
      const manager = new RedisManager();
      RedisManager.manager = manager;
      manager.client = createClient({
        host: Config.redisHost,
        port: 6379,
        // auth_pass: Config.redisAuthKey,
      });

      manager.subscribeClient = createClient({
        host: Config.redisHost,
        port: 6379,
        // auth_pass: Config.redisAuthKey,
      });

      // todo promise all for subscriber client
      manager.client.on('ready', (result) => {
        // console.timeEnd('connecting redis');
        res(manager);
      });
    });
  }
}
