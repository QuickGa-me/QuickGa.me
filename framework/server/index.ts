import {Message, SerializedGameState} from "@framework-common/models";


export type GameState = {
    currentTick: number;
    players: PlayerState[];
};

export type PlayerState = {
    playerId: string;
    avatar: string;
    name: string;
    color: string;
};


export interface ServerConfig {
    logicTickInterval: -1 | number;
}
export interface Achievement {}

export abstract class QGServer {
    currentTick: number;
    state: GameState;
    constructor(config: ServerConfig) {}

    abstract onTick(msSinceLastTick: number): void;
    sendMessageToPlayer(playerId: string, message: Message): void {
        /*todo*/
    }
    sendMessageToEveryone(message: Message): void {
        /*todo*/
    }
    awardAchievement(achievement: Achievement): void {
        /*todo, verify with server*/
    }

    get receivedMessages(): Message[] {
        /* todo */ return null!;
    }
    abstract receiveMessages(message: Message): void;

    abstract onPlayerJoin(): PlayerState;
    abstract onPlayerLeave(): GameState;

    abstract serializeState(): SerializedGameState;
}



/*import {Server} from 'ws';

export class ServerApp {

    constructor() {
        const wss = new Server({port: 7898});
        console.log('server open');

        wss.on('connection', (ws) => {
            ws.binaryType = "arraybuffer";
            ws.on('message', (m: string) => {
                let message = JSON.parse(m) ;
            });

            ws.on('close', () => {
            });
        });
    }


}

new ServerApp();*/