import {useClock} from '../hooks/useClock';
import {FC} from 'react';
import React from 'react';

export const CountDown: FC<{time: number}> = ({time}) => {
  useClock(1000);

  return <>{Math.max(Math.round((time - +new Date()) / 1000), 0)}</>;
};
