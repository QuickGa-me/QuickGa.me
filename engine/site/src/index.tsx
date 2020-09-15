import './index.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import {webStores} from './store/webStores';
import {BrowserRouter} from 'react-router-dom';
import {Route} from 'react-router';
import {observer, Provider} from 'mobx-react';
import {Home} from './screens/home/home';
import {BottomMessage} from './components/bottomMessage';

const App = observer(() => {
  return (
    <>
      <BrowserRouter>
        <Route exact path="/" component={Home} />
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
