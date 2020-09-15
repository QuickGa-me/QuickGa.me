import './home.scss';
import {FC, ReactNode} from 'react';
import React from 'react';
import {observer} from 'mobx-react';
import {useEffectAsync} from '../../hooks/useEffectAsync';
import {Box} from '../../components/box';
import useInView from 'react-cool-inview';
import {useMountRequest} from '../../hooks/useMountRequest';
import {GameDetailsClient} from '../../dataServices/app.generated';
import {Loading} from '../../components/loading';
import {Link} from 'react-router-dom';

export const Home: FC = observer(() => {
  useEffectAsync(async () => {}, []);
  const {loading, gamesResult} = useMountRequest('gamesResult', () => GameDetailsClient.getGames({}, {}));
  return (
    <>
      Quick Game!
      <div className="container mx-auto flex p-6 bg-white rounded-lg shadow-xl flex flex-col">
        <div>Games</div>
        {loading ? (
          <Loading />
        ) : gamesResult ? (
          <div className={'grid grid-cols-2 gap-4'}>
            {gamesResult.games.map((game) => {
              return (
                <Link
                  to={`/game/${game.id}`}
                  key={game.id}
                  className={'block flex p-2 bg-gray-200 rounded-lg shadow-xl flex flex-col'}
                  style={{height: 250}}
                >
                  <div style={{backgroundImage: `url(${game.logo})`}} className={'bg-cover flex flex-1'}></div>
                  <div className={'flex flex-col'} style={{height: 50}}>
                    <span className={'text-3xl'}>{game.name}</span>
                    <div>{game.description}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          'Sorry an error has occurred'
        )}
      </div>
    </>
  );
});

