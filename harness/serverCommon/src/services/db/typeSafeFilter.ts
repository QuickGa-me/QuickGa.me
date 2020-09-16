type BSONTypeAlias =
  | 'number'
  | 'double'
  | 'string'
  | 'object'
  | 'array'
  | 'binData'
  | 'undefined'
  | 'ObjectId'
  | 'bool'
  | 'date'
  | 'null'
  | 'regex'
  | 'dbPointer'
  | 'javascript'
  | 'symbol'
  | 'javascriptWithScope'
  | 'int'
  | 'timestamp'
  | 'long'
  | 'decimal'
  | 'minKey'
  | 'maxKey';

// we can search using alternative types in mongodb e.g.
// string types can be searched using a regex in mongo
// array types can be searched using their element type
type RegExpForString<T> = T extends string ? RegExp | T : T;
export type MongoAltQuery<T> = T extends Array<infer U> ? T | RegExpForString<U> : RegExpForString<T>;

/** https://docs.mongodb.com/manual/reference/operator/query/#query-selectors */
export type QuerySelector<T> = {
  // Array
  // TODO: define better types for $all and $elemMatch
  $all?: T extends Array<infer U> ? SafeFilterQuery<U>[] : never;
  $elemMatch?: T extends Array<infer U> ? SafeFilterQuery<U> : never;
  // Comparison
  $eq?: T;
  // Element
  /**
   * When `true`, `$exists` matches the documents that contain the field,
   * including documents where the field value is null.
   */
  $exists?: boolean;
  // Geospatial
  // TODO: define better types for geo queries
  $geoIntersects?: {$geometry: never /*todo fix*/};
  $geoWithin?: never /*todo fix*/;
  $gt?: T;
  $gte?: T;
  $in?: T[];
  $lt?: T;
  $lte?: T;
  $maxDistance?: number;
  $mod?: T extends number ? [number, number] : never;
  $ne?: T;
  $near?: T extends [number, number]
    ? {
        $geometry: {coordinates: readonly [number, number]; type: 'Point'};
        $maxDistance: number;
        $minDistance: number;
      }
    : never;
  $nearSphere?: never /*todo fix*/;
  $nin?: T[];
  // Logical
  $not?: T extends string ? QuerySelector<T> | RegExp : QuerySelector<T>;
  $options?: T extends string ? string : never;
  $regex?: T extends string ? RegExp | string : never;
  $size?: T extends Array<infer U> ? number : never;
  // Bitwise
};

export type RootQuerySelector<T> = {
  /** https://docs.mongodb.com/manual/reference/operator/query/and/#op._S_and */
  $and?: Array<SafeFilterQuery<T>>;
  /** https://docs.mongodb.com/manual/reference/operator/query/comment/#op._S_comment */
  $comment?: string;
  /** https://docs.mongodb.com/manual/reference/operator/query/nor/#op._S_nor */
  $nor?: Array<SafeFilterQuery<T>>;
  /** https://docs.mongodb.com/manual/reference/operator/query/or/#op._S_or */
  $or?: Array<SafeFilterQuery<T>>;
  /** https://docs.mongodb.com/manual/reference/operator/query/text */
  $text?: {
    $caseSensitive?: boolean;
    $diacraticSensitive?: boolean;
    $language?: string;
    $search: string;
  };
  // we could not find a proper TypeScript generic to support nested queries e.g. 'user.friends.name'
  // this will mark all unrecognized properties as any (including nested queries)
};

export type SafeFilterQuery<T> = {
  [P in keyof T]?: MongoAltQuery<T[P]> | QuerySelector<MongoAltQuery<T[P]>>;
} &
  RootQuerySelector<T>;

type FilteredKeys<T, U> = {[P in keyof T]: T[P] extends U ? never : P}[keyof T];
type FilteredValues<T, TExclude> = {[key in FilteredKeys<T, TExclude>]: T[key]};
type c = FilteredValues<{a: never; b: number; c: string}, never>; // {b:number;c:string}

export type UpdateQuery2<T> = {
  $addToSet?: {[P in keyof T]?: any};
  $bit?: {[P in keyof T]?: any};
  $currentDate?:
    | {[P in keyof T]?: true | {$type: 'date' | 'timestamp'}}
    | {[key: string]: true | {$type: 'date' | 'timestamp'}};
  $each?: Partial<T>;
  $inc?: {[P in keyof T]?: number};
  $max?: {[P in keyof T]?: number};
  $min?: {[P in keyof T]?: number};
  $mul?: {[P in keyof T]?: number};
  $pop?: {[P in keyof T]?: -1 | 1};
  $pull?: SafeFilterQuery<T>;
  $push?: {[key in ArrayKeys<T>]?: UnArray<T[key]>};
  $pushAll?: {[key in ArrayKeys<T>]?: T[key]};
  $rename?: {[key: string]: keyof T};
  $set?: Partial<T>;
  $setOnInsert?: Partial<T>;
  $unset?: {[P in keyof T]?: ''};
};

export type ArrayKeys<T> = {[key in keyof T]: T[key] extends any[] ? key : never}[keyof T];
export type UnArray<T> = T extends Array<infer A> ? A : T;
