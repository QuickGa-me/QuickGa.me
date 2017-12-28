import * as React from 'react';
import {render} from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';
import {Home} from "./components/home";
import {Game} from "./components/game";


const Wrapper = () => (
    <Router>
        <>
        <Route exact path="/" component={Home}/>
        <Route path="/game/:gameId" component={Game}/>
        </>
    </Router>
);

render(<Wrapper/>, document.getElementById('site'));


/*
AssetManager.addAsset("ship1", "./assets/ships/ship1.png", {width: 64, height: 48}, {x: 0, y: 0});
AssetManager.addAsset("ship2", "./assets/ships/ship2.png", {width: 64, height: 48}, {x: 0, y: 0});
AssetManager.start();


*/

