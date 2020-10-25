import {FC, ReactNode, useCallback, useRef, useState} from 'react';
import React from 'react';
import {observer} from 'mobx-react';
import {useEffectAsync} from '../../hooks/useEffectAsync';
import {GameClient} from '../../dataServices/app.generated';
import {useComponentSize} from '../../hooks/useComponentSize';

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
  const gameContainer = useRef<HTMLDivElement>(null);
  const {width} = useComponentSize(gameContainer);
  return (
    <>
      <div>
        <div className="container mx-auto flex flex-col bg-white rounded-lg shadow-xl my-2">
          <div>
            <span>{error}</span>
            <button className={'btn btn-blue'} onClick={onNewGame} disabled={loadingNewGame}>
              Start New Game
            </button>
            <div className="mb-4">
              <label className="form-label" htmlFor="players">
                Number of players
              </label>

              <div className="relative">
                <select
                  id="players"
                  value={numberOfPlayers}
                  onChange={(e) => {
                    setNumberOfPlayers(parseInt(e.target.value));
                    onNewGame();
                  }}
                  className="form-select"
                >
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                  <option>7</option>
                  <option>8</option>
                </select>

                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div ref={gameContainer} key={newGameKey} className={'flex flex-1 flex-wrap'}>
            {[...Array(numberOfPlayers).keys()].map((p) => (
              <iframe
                key={p}
                src={'http://localhost:55555'}
                width={width / 2}
                height={width / 2}
                style={{border: 'solid 1px blue'}}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
});
