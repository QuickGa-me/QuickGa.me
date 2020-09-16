import './gameDetails.css';
import {FC, ReactNode, useCallback} from 'react';
import React from 'react';
import {observer} from 'mobx-react';
import {useEffectAsync} from '../../hooks/useEffectAsync';
import {Box} from '../../components/box';
import {useMountRequest} from '../../hooks/useMountRequest';
import {GameDetailsClient} from '../../dataServices/app.generated';
import {Loading} from '../../components/loading';
import {Link, Redirect, useRouteMatch} from 'react-router-dom';

export const GameDetails: FC = observer(() => {
  const {
    params: {gameId},
  } = useRouteMatch<{gameId: string}>();
  if (!gameId) {
    return <Redirect to={'/'} />;
  }

  const {loading, gameDetails} = useMountRequest('gameDetails', () => GameDetailsClient.getGameDetails({gameId}, {}));
  const onJoinLobby = useCallback(async () => {}, []);
  const onStartPrivateGame = useCallback(async () => {}, []);
  return (
    <>
      <div className="container mx-auto flex p-6 bg-white rounded-lg shadow-xl flex flex-col">
        {loading ? (
          <Loading />
        ) : gameDetails ? (
          <div key={gameDetails.details.id} className={'block flex p-2 bg-gray-200 rounded-lg shadow-xl flex flex-col'}>
            <div
              style={{backgroundImage: `url(${gameDetails.details.logo})`, height: 200, width: '100%'}}
              className={'bg-cover'}
            />
            <div className={'flex flex-col p-3'}>
              <span className={'text-3xl'}>{gameDetails.details.name}</span>
              <span className={'text-2xl'}>Made By: {gameDetails.details.author}</span>
              <div>{gameDetails.details.description}</div>
              <div>{gameDetails.details.numberOfActivePlayers} Active Players</div>
              <div className={'flex justify-around'}>
                <button className="btn btn-blue w-1/4">Join Lobby</button>
                <button className="btn btn-blue w-1/4">Join Game</button>
                <button className="btn btn-blue w-1/4">Start Private Game</button>
              </div>
            </div>
          </div>
        ) : (
          'Sorry an error has occurred'
        )}
      </div>
    </>
  );
});
