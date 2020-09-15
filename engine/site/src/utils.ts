export class Utils {
  static arrayToDictionary<T>(array: T[], callback: (t: T) => string | number): {[key: string]: T} {
    return array.reduce((a, b) => {
      a[callback(b)] = b;
      return a;
    }, {} as any);
  }

  static checksum(a: Uint8Array): number {
    const len = a.length;
    let fnv = 0;
    for (let i = 0; i < len; i++) {
      fnv = (fnv + (((fnv << 1) + (fnv << 4) + (fnv << 7) + (fnv << 8) + (fnv << 24)) >>> 0)) ^ (a[i] & 0xff);
    }
    return fnv >>> 0;
  }

  static flattenArray<T>(arrays: T[][]): T[] {
    return Array.prototype.concat.apply([], arrays);
  }

  static groupBy<T, TKey>(items: T[], predicate: (pred: T) => TKey): {items: T[]; key: TKey}[] {
    const groups: {items: T[]; key: TKey}[] = [];
    for (const item of items) {
      const key = predicate(item);
      let group = groups.find((a) => a.key === key);
      if (!group) {
        groups.push((group = {key, items: []}));
      }
      group.items.push(item);
    }
    return groups;
  }

  static groupByArr<T, TKey>(items: T[], predicate: (pred: T) => TKey): {items: T[]; key: TKey}[] {
    const groups: {items: T[]; key: TKey}[] = [];
    for (const item of items) {
      const key = predicate(item);
      let group = groups.find((a) => a.key === key);
      if (!group) {
        groups.push((group = {key, items: []}));
      }
      group.items.push(item);
    }
    return groups;
  }

  static groupByMap<T, TKey extends string, TResult>(
    array: T[],
    callback: (t: T) => TKey,
    resultCallback: (t: T) => TResult
  ): {[key in TKey]: TResult[]} {
    const groups: {[key in TKey]: T[]} = {} as any;
    for (const item of array) {
      const result = callback(item);
      if (!groups[result]) {
        groups[result] = [];
      }
      groups[result].push(item);
    }
    const maps: {[key in TKey]: TResult[]} = {} as any;

    for (const group in groups) {
      maps[group] = groups[group].map((a) => resultCallback(a));
    }

    return maps;
  }

  static groupByReduce<T, TKey extends number, TResult>(
    array: T[],
    callback: (t: T) => TKey,
    resultCallback: (t: T[]) => TResult
  ): {[key in TKey]: TResult} {
    const groups: {[key in TKey]: T[]} = {} as any;
    for (const item of array) {
      const result = callback(item);
      if (!groups[result]) {
        groups[result] = [];
      }
      groups[result].push(item);
    }
    const maps: {[key in TKey]: TResult} = {} as any;

    for (const group in groups) {
      maps[group] = resultCallback(groups[group]);
    }

    return maps;
  }

  static mapMany<T, T2>(array: T[], callback: (a: T) => T2[]): T2[] {
    const result: T2[] = [];
    for (const winningVote of array) {
      result.push(...callback(winningVote));
    }
    return result;
  }

  static mapObjToArray<TKey extends string, TBefore, TAfter>(
    obj: {[key in TKey]: TBefore},
    callback: (t: TKey, b: TBefore) => TAfter
  ): TAfter[] {
    const result: TAfter[] = [];
    for (const key in obj) {
      result.push(callback(key, obj[key]));
    }
    return result;
  }

  static mapObjToObj<TKey extends number, TBefore, TAfter>(
    obj: {[key in TKey]: TBefore},
    callback: (t: TKey, b: TBefore) => TAfter
  ): {[key in TKey]: TAfter} {
    const result: {[key in TKey]: TAfter} = {} as any;

    for (const key in obj) {
      result[key] = callback(key, obj[key]);
    }
    return result;
  }

  static mapToObj<TKey extends number, TResult>(
    array: TKey[],
    callback: (t: TKey) => TResult
  ): {[key in TKey]: TResult} {
    return array.reduce((a, b) => {
      a[b] = callback(b);
      return a;
    }, {} as any);
  }

  static mathSign(f: number) {
    if (f < 0) {
      return -1;
    } else if (f > 0) {
      return 1;
    }
    return 0;
  }

  static random(chance: number) {
    return Math.random() * 100 < chance;
  }
  static randomItem<T>(item: T[]): T {
    return item[Math.floor(Math.random() * item.length)];
  }
  static randomElement<T>(array: T[]) {
    const n = Math.floor(Math.random() * (array.length - 1));
    return array[n];
  }

  static randomRange(low: number, high: number) {
    const n = Math.round(Math.random() * (high - low) + low);
    return n;
  }

  static range(start: number, finish: number) {
    const r: number[] = [];
    for (let i = start; i < finish; i++) {
      r.push(i);
    }
    return r;
  }

  static roundUpTo8(value: number) {
    return value + (8 - (value % 8));
  }

  static safeKeys<T>(obj: T): (keyof T)[] {
    return Object.keys(obj) as (keyof T)[];
  }

  static safeKeysExclude<T, TExclude extends keyof T>(obj: T, exclude: TExclude): Exclude<keyof T, TExclude>[] {
    return Object.keys(obj).filter((key) => key !== exclude) as Exclude<keyof T, TExclude>[];
  }

  static scaleFontSize(text: string) {
    const baseSize = 12;
    let textLength = text.length;
    if (textLength >= baseSize) {
      textLength = baseSize - 2;
    }
    const fontSize = baseSize - textLength;
    return `${fontSize}vw`;
  }

  static sort<T>(array: T[], callback: (t: T) => number): T[] {
    const sorted = [...array];
    sorted.sort((a, b) => callback(a) - callback(b));
    return sorted;
  }

  static sortDesc<T>(array: T[], callback: (t: T) => number): T[] {
    const sorted = [...array];
    sorted.sort((a, b) => callback(b) - callback(a));
    return sorted;
  }

  static sum<T>(array: T[], callback: (t: T) => number): number {
    return array.reduce((a, b) => a + callback(b), 0);
  }
  static switchType<TType extends string | number, TResult>(n: TType, options: {[key in TType]: TResult}): TResult {
    if (options[n] === undefined) {
      throw new Error(`'Type not found', ${n}, ${JSON.stringify(options)}`);
    }
    return options[n];
  }

  static timeout(timeout: number): Promise<void> {
    return new Promise((res) => {
      setTimeout(() => {
        res();
      }, timeout);
    });
  }

  static timeoutPromise<T>(
    promise: Promise<T>,
    timeout: number,
    defaultValue: T,
    failCallback: () => Promise<any>
  ): Promise<T> {
    return new Promise<T>((res) => {
      let resolved = false;
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          failCallback().then(() => res(defaultValue));
        }
      }, timeout);

      promise.then((items) => {
        if (!resolved) {
          resolved = true;
          res(items);
        }
      });
    });
  }

  static toDictionary<T, TKey extends string>(items: T[], predicate: (pred: T) => TKey): {[key in TKey]?: T} {
    const dict: {[key in TKey]?: T} = {};
    for (const item of items) {
      const key = predicate(item);
      dict[key] = item;
    }
    return dict;
  }

  static unique<T>(strings: T[]): T[] {
    return strings.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
  }
}

export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}

export function unreachable(t: never) {}

export function objectSafeKeys<T>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

export function assert(assertion: boolean): asserts assertion {}
export function assertType<T>(assertion: any): asserts assertion is T {}
