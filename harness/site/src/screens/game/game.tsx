import {FC, ReactNode, useCallback, useState} from 'react';
import React from 'react';
import {observer} from 'mobx-react';
import {useEffectAsync} from '../../hooks/useEffectAsync';
import {GameClient} from '../../dataServices/app.generated';

export const Game: FC = observer(() => {
  const [numberOfPlayers, setNumberOfPlayers] = useState(4);
  const [error, setError] = useState<string>();
  const [loadingNewGame, setLoadingNewGame] = useState(false);
  const [newGameKey, setNewGameKey] = useState('initial');
  const onNewGame = useCallback(async () => {
    setLoadingNewGame(true);
    const result = await GameClient.newGame({gameRules: {items: []}, numberOfPlayers}, {});
    if (result) {
      setError(result.error);
    }
    setNewGameKey(Math.random().toFixed(10));
    setLoadingNewGame(false);
  }, [numberOfPlayers]);
  useEffectAsync(async () => {}, []);
  return (
    <>
      <div className="container mx-auto flex p-6 bg-white rounded-lg shadow-xl flex flex-col">
        <span>{error}</span>
        <button onClick={onNewGame} disabled={loadingNewGame}>
          Start New Game
        </button>
        <div key={newGameKey}>
          {[...Array(numberOfPlayers).keys()].map((p) => (
            <>
              <iframe
                key={p}
                src={'http://localhost:55555'}
                width={300}
                height={300}
                style={{border: 'solid 10px blue'}}
              />
            </>
          ))}
        </div>
      </div>
    </>
  );
});
