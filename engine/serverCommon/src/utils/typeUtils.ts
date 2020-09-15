export type Discriminate<T, TField extends keyof T, TValue extends T[TField]> = T extends {[field in TField]: TValue}
  ? T
  : never;

export function assert(assertion: boolean): asserts assertion {}
export function assertType<T>(assertion: any): asserts assertion is T {}
