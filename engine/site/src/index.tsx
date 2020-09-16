import './index.scss';
import './styles/tailwind.css';
import React from 'react';
import ReactDOM from 'react-dom';
import {webStores} from './store/webStores';
import {BrowserRouter} from 'react-router-dom';
import {Route} from 'react-router';
import {observer, Provider} from 'mobx-react';
import {Home} from './screens/home/home';
import {BottomMessage} from './components/bottomMessage';
import {GameDetails} from './screens/gameDetails/gameDetails';

const App = observer(() => {
  return (
    <>
      <BrowserRouter>
        <Route exact path="/" component={Home} />
        <Route exact path="/game/:gameId" component={GameDetails} />
      </BrowserRouter>
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
