import {FC, useCallback, useState} from 'react';
import * as React from 'react';
import {BoxCardButton, ButtonBoxCardProps} from './boxCard';

export const PromiseBoxCardButton: FC<
  ButtonBoxCardProps & {
    onClick: () => Promise<any>;
  }
> = ({onClick, ...rest}) => {
  const [loading, setLoading] = useState(false);

  const onClickResolve = useCallback(async () => {
    setLoading(true);
    await onClick();
    setLoading(false);
  }, [onClick]);

  return <BoxCardButton {...rest} onClick={onClickResolve} loading={loading} />;
};
