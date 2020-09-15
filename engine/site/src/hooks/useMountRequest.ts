import {useComponentWill} from './useComponentWill';
import {useState} from 'react';

export function useMountRequest<TPromise extends Promise<any>, TKey extends string | number | symbol>(
  key: TKey,
  callback: () => TPromise
): {[tKey in TKey]: Unpromise<TPromise> | undefined} & {loading: boolean} {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<Unpromise<TPromise>>();
  useComponentWill(async () => {
    setLoading(true);
    const callbackResult = await callback();
    if (callbackResult) {
      setResult(callbackResult);
    }
    setLoading(false);
  });
  return {
    loading,
    [key]: result,
  } as any;
}
export type Unpromise<MaybePromise> = MaybePromise extends Promise<infer Type> ? Type : MaybePromise;
