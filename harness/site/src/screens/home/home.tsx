import './home.scss';
import {FC, ReactNode} from 'react';
import React from 'react';
import {observer} from 'mobx-react';
import {useEffectAsync} from '../../hooks/useEffectAsync';
import {Link} from 'react-router-dom';

export const Home: FC = observer(() => {
  useEffectAsync(async () => {}, []);
  return (
    <>
      <div className="container mx-auto flex p-6 bg-white rounded-lg shadow-xl flex flex-col">
        <div>QuickGame Test Harness!</div>
        <Link to={'/game'}>Go to game!</Link>
      </div>
    </>
  );
});
