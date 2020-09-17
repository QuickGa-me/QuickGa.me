import {FC, ReactNode} from 'react';
import React from 'react';
import {observer} from 'mobx-react';
import {useEffectAsync} from '../../hooks/useEffectAsync';

export const Game: FC = observer(() => {
  useEffectAsync(async () => {}, []);
  return (
    <>
      <div className="container mx-auto flex p-6 bg-white rounded-lg shadow-xl flex flex-col">
        <iframe src={'http://localhost:55555'} width={500} height={500} style={{border: 'solid 10px blue'}} />
      </div>
    </>
  );
});
