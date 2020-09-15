import {FC, ReactNode} from 'react';
import React from 'react';
import {observer} from 'mobx-react';
import {useEffectAsync} from '../../hooks/useEffectAsync';
import {Box} from '../../components/box';
import {useMountRequest} from '../../hooks/useMountRequest';
import {GameDetailsClient} from '../../dataServices/app.generated';
import {Loading} from '../../components/loading';
import {Link, useRouteMatch} from 'react-router-dom';

export const GameDetails: FC = observer(() => {
  const {
    params: {gameId},
  } = useRouteMatch<{gameId: string}>();

  useEffectAsync(async () => {}, []);

  const {loading, gameDetails} = useMountRequest('gameDetails', () => GameDetailsClient.getGameDetails({gameId}, {}));

  return (
    <>
      <div className="container mx-auto flex p-6 bg-white rounded-lg shadow-xl flex flex-col">
        <div>Games</div>
        {loading ? (
          <Loading />
        ) : gameDetails ? (
          <div
            key={gameDetails.details.id}
            className={'block flex p-2 bg-gray-200 rounded-lg shadow-xl flex flex-col'}
            style={{height: 250}}
          >
            <div style={{backgroundImage: `url(${gameDetails.details.logo})`}} className={'bg-cover flex flex-1'}></div>
            <div className={'flex flex-col'} style={{height: 50}}>
              <span className={'text-3xl'}>{gameDetails.details.name}</span>
              <span className={'text-2xl'}>Made By: {gameDetails.details.author}</span>
              <div>{gameDetails.details.description}</div>
              <div>{gameDetails.details.numberOfActivePlayers} Active Players</div>
            </div>
            <button className="btn btn-blue">
              Button
            </button>
          </div>
        ) : (
          'Sorry an error has occurred'
        )}
      </div>
    </>
  );
});

