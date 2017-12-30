import * as React from 'react';
import {render} from 'react-dom';
import {BrowserRouter as Router, Route, Link, HashRouter} from 'react-router-dom';
import {Home} from './pages/home';
import {Game} from './pages/game';
import {LiveGame} from './pages/liveGame';
import {Lobby} from './pages/lobby';

const Wrapper = () => (
    <HashRouter>
        <>
            <Route exact path="/" component={Home} />
            <Route path="/live-game/:liveGameId" component={LiveGame} />
            <Route path="/game/:gameId" component={Game} />
            <Route path="/lobby/:gameId" component={Lobby} />
        </>
    </HashRouter>
);

render(<Wrapper />, document.getElementById('site'));

/*
AssetManager.addAsset("ship1", "./assets/ships/ship1.png", {width: 64, height: 48}, {x: 0, y: 0});
AssetManager.addAsset("ship2", "./assets/ships/ship2.png", {width: 64, height: 48}, {x: 0, y: 0});
AssetManager.start();


*/
