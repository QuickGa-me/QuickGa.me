import React, {useEffect, useRef, useState} from 'react';
const game = require('./bundle');

export function GameWrapper() {
  const [disconnected, setDisconnected] = useState(false);
  const [ready, setReady] = useState(false);
  if (!game || !game.default) {
    return <>Game not bundled.</>;
  }
  const liveGame = useRef(new game.default());

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:33333');
    socket.onmessage = (message) => {
      liveGame.current.onMessage(message);
    };
    socket.onerror = (a) => {
      console.log(a);
    };
    socket.onclose = (e) => {
      console.log(e);
      setDisconnected(true);
    };
    socket.onopen = () => {
      setReady(true);
    };
    setInterval(() => {
      liveGame.current.draw(10);
    }, 16);
  }, []);

  if (!ready) {
    return <>Connecting...</>;
  }
  if (disconnected) {
    return <>Disconnected</>;
  }

  return <>{liveGame.current.render()}</>;
}
