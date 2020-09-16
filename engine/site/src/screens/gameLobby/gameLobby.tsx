import './gameLobby.css';
import {FC, ReactNode, useCallback, useEffect, useRef, useState} from 'react';
import React from 'react';
import {observer} from 'mobx-react';
import {useEffectAsync} from '../../hooks/useEffectAsync';
import {Box} from '../../components/box';
import {useMountRequest} from '../../hooks/useMountRequest';
import {
  GameDetailsClient,
  HttpLobbyDetails,
  LobbyPlayersResponse,
  LobbySocketClient,
  LobbySocketEvents,
  LobbyVoteStartResponse,
} from '../../dataServices/app.generated';
import {Loading} from '../../components/loading';
import {Link, Redirect, useRouteMatch} from 'react-router-dom';
import {useComponentWill} from '../../hooks/useComponentWill';

export const GameLobby: FC = observer(() => {
  const {
    params: {lobbyId},
  } = useRouteMatch<{lobbyId: string}>();
  if (!lobbyId) {
    return <Redirect to={'/'} />;
  }

  const [loading, setLoading] = useState(true);
  const [voteStart, setVoteStart] = useState(false);
  const [lobby, setLobby] = useState<HttpLobbyDetails>();
  const [gameStarting, setGameStarting] = useState(false);
  const [players, setPlayers] = useState<LobbyPlayersResponse['players']>([]);
  const [votes, setVotes] = useState<LobbyVoteStartResponse['votes']>({start: 0, notStart: 0});
  const lobbySocket = useRef(new LobbySocketClient());

  const onConnect = useCallback<LobbySocketEvents['onConnect']>(() => {
    lobbySocket.current.join({});
  }, []);
  const onDisconnect = useCallback<LobbySocketEvents['onDisconnect']>(() => {}, []);
  const onLobbyDetails = useCallback<LobbySocketEvents['onLobbyDetails']>((e) => {
    setLoading(false);
    setLobby(e.lobby);
  }, []);
  const onLobbyPlayers = useCallback<LobbySocketEvents['onLobbyPlayers']>((e) => {
    setPlayers(e.players);
  }, []);
  const onGameStarted = useCallback<LobbySocketEvents['onGameStarted']>((e) => {
    alert('game started ' + e.gameUrl);
  }, []);
  const onGameStarting = useCallback<LobbySocketEvents['onGameStarting']>((e) => {
    setGameStarting(true);
  }, []);
  const onVoteStart = useCallback<LobbySocketEvents['onVoteStart']>((e) => {
    setVotes(e.votes);
  }, []);

  useComponentWill(
    () => {
      lobbySocket.current.connect({
        onConnect,
        onDisconnect,
        onLobbyDetails,
        onLobbyPlayers,
        onGameStarted,
        onGameStarting,
        onVoteStart,
      });
    },
    () => {
      lobbySocket.current.disconnect();
    }
  );
  useEffect(() => {
    lobbySocket.current.events!.onConnect = onConnect;
    lobbySocket.current.events!.onDisconnect = onDisconnect;
    lobbySocket.current.events!.onLobbyDetails = onLobbyDetails;
    lobbySocket.current.events!.onLobbyPlayers = onLobbyPlayers;
    lobbySocket.current.events!.onGameStarted = onGameStarted;
    lobbySocket.current.events!.onGameStarting = onGameStarting;
    lobbySocket.current.events!.onVoteStart = onVoteStart;
  }, [onConnect, onDisconnect, onLobbyDetails, onLobbyPlayers, onGameStarted, onGameStarting, onVoteStart]);

  const onPlayerVoteStart = useCallback(() => {
    if (voteStart) return;
    setVoteStart(true);
    lobbySocket.current.voteStart({voteStart: true});
  }, []);
  return (
    <>
      <div className="container mx-auto flex p-6 bg-white rounded-lg shadow-xl flex flex-col">
        {loading ? (
          'Connecting to lobby'
        ) : lobby ? (
          <div className={'block flex p-2 bg-gray-200 rounded-lg shadow-xl flex'}>
            <div className={'flex flex-col p-3'}>
              <span className={'text-3xl'}>{lobby.lobbyCode}</span>
              <div className={'flex justify-around'}>
                <button className="btn btn-blue w-1/4" onClick={onPlayerVoteStart}>
                  Vote start
                </button>
              </div>
            </div>
            <div className={'flex flex-col p-3 w-1/4'}>
              <span className={'text-3xl'}>Players</span>
              {players.map((p) => (
                <div className={'flex justify-around'} key={p.player.playerId}>
                  <span className={'text-l'} style={{color: p.connected ? 'black' : 'grey'}}>
                    {p.player.name}
                  </span>
                </div>
              ))}
            </div>
            {gameStarting && <span className={'text-3xl'}>GAME STARTING!</span>}
            {votes.start > 0 && (
              <div>
                Votes {votes.start}/{votes.notStart}
              </div>
            )}
          </div>
        ) : (
          'Sorry an error has occurred'
        )}
      </div>
    </>
  );
});
