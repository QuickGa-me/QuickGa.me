import './index.scss';
import './styles/tailwind.css';
import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import {useWebStores, webStores} from './store/webStores';
import {BrowserRouter} from 'react-router-dom';
import {Route} from 'react-router';
import {observer, Provider} from 'mobx-react';
import {Home} from './screens/home/home';
import {BottomMessage} from './components/bottomMessage';
import {GameDetails} from './screens/gameDetails/gameDetails';
import {GameLobby} from './screens/gameLobby/gameLobby';
import {useComponentWill} from './hooks/useComponentWill';
import {PlayerClient} from './dataServices/app.generated';
import {handle400} from './dataServices/baseClient';
import {create} from 'mobx-persist';

const App = observer(() => {
   const {playerStore} = useWebStores();
  const [ready, setReady] = useState(false);
  useComponentWill(async () => {
    const hydrate = create({});
    hydrate('playerStore', playerStore);

    if (!playerStore.jwt) {
      const result = await PlayerClient.playAnon({}, handle400);
      if (result) {
        playerStore.setJwt(result.jwt);
        playerStore.setPlayer(result.player);
      }
    }
    setReady(true);
  });

  return (
    <>
      {/*{ready && (*/}
      <BrowserRouter>
        <Route exact path="/" component={Home} />
        <Route exact path="/game/:gameId" component={GameDetails} />
        <Route exact path="/lobby/:lobbyId" component={GameLobby} />
      </BrowserRouter>
      {/*)}*/}
      <BottomMessage message={webStores.uiStore.message} setMessage={(m) => webStores.uiStore.setMessage(m)} />
    </>
  );
});

ReactDOM.render(
  <React.StrictMode>
    <Provider {...webStores}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
