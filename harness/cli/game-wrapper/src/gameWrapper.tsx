import React, {useEffect, useRef} from 'react';
const game = require('./bundle');

export function GameWrapper() {
  if (!game || !game.default) {
    return <>Game not bundled.</>;
  }
  const liveGame = useRef(new game.default());

  useEffect(() => {
    setInterval(() => {
      liveGame.current.draw(10);
    }, 16);
  }, []);

  return <>{liveGame.current.render()}</>;
}
