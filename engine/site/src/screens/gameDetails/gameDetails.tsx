import './gameDetails.css';
import {FC, ReactNode, useCallback, useState} from 'react';
import React from 'react';
import {observer} from 'mobx-react';
import {useEffectAsync} from '../../hooks/useEffectAsync';
import {Box} from '../../components/box';
import {useMountRequest} from '../../hooks/useMountRequest';
import {GameDetailsClient} from '../../dataServices/app.generated';
import {Loading} from '../../components/loading';
import {Link, Redirect, useHistory, useRouteMatch} from 'react-router-dom';
import {handle400} from '../../dataServices/baseClient';

export const GameDetails: FC = observer(() => {
  const {
    params: {gameId},
  } = useRouteMatch<{gameId: string}>();
  if (!gameId) {
    return <Redirect to={'/'} />;
  }
  const history = useHistory();

  const [findingLobby, setFindingLobby] = useState(false);

  const {loading, gameDetails} = useMountRequest('gameDetails', () =>
    GameDetailsClient.getGameDetails({gameId}, handle400)
  );
  const onJoinLobby = useCallback(async () => {
    setFindingLobby(true);
    const result = await GameDetailsClient.joinLobby({gameId, rules: {items: []}}, handle400);
    if (result) {
      history.push(`/lobby/${result.lobbyId}`);
    }
    setFindingLobby(false);
  }, []);
  const onJoinGame = useCallback(async () => {
    const lobbyCode = prompt('What is the game code');
    if (lobbyCode) {
      setFindingLobby(true);
      const result = await GameDetailsClient.joinGame({gameId, lobbyCode}, handle400);
      if (result) {
        history.push(`/lobby/${result.lobbyId}`);
      }
      setFindingLobby(false);
    }
  }, []);
  const onStartPrivateGame = useCallback(async () => {
    setFindingLobby(true);
    const result = await GameDetailsClient.startPrivateLobby({gameId, rules: {items: []}}, handle400);
    if (result) {
      history.push(`/lobby/${result.lobbyId}`);
    }
    setFindingLobby(false);
  }, []);
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
                <button className="btn btn-blue w-1/4" onClick={onJoinLobby}>
                  Join Lobby
                </button>
                <button className="btn btn-blue w-1/4" onClick={onJoinGame}>
                  Join Game
                </button>
                <button className="btn btn-blue w-1/4" onClick={onStartPrivateGame}>
                  Start Private Game
                </button>
              </div>
            </div>
            {findingLobby ? <Loading /> : <></>}
          </div>
        ) : (
          'Sorry an error has occurred'
        )}
      </div>
    </>
  );
});
