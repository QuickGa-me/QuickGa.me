import React from 'react';
const game = require('./bundle');

export function GameWrapper() {
    if (!game || !game.default) {
        return <>Game not bundled.</>;
    }
    const result = new game.default();
    return <>hi</>;
}
