export type Message = {tickRecieved: number} & ({type: 'ping'} | {type: 'player-join'} | {type: 'pong'});

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

export type SerializedGameState = {
    players: SerializedPlayerState[];
};
export type SerializedPlayerState = {
    playerId: string;
    avatar: string;
    name: string;
    color: string;
};

export interface ServerConfig {
    logicTickInterval: -1 | number;
}
export interface Achievement {}

export abstract class Server {
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
        /* todo */ return null;
    }
    abstract receiveMessages(message: Message): void;

    abstract onPlayerJoin(): PlayerState;
    abstract onPlayerLeave(): GameState;

    abstract serializeState(): SerializedGameState;
}

export abstract class Client {
    abstract initializeUI(ui: {
        canvas: HTMLCanvasElement;
        context: CanvasRenderingContext2D;
        parent: HTMLDivElement;
    }): void;
    abstract initializeState(state: SerializedGameState): void;

    sendMessage(message: Message): void {
        /*todo*/
    }
    abstract logicTick(): void;
    abstract draw(msSinceLastDraw: number): void;
    get receivedMessages(): Message[] {
        /* todo */ return null;
    }
    abstract receiveMessages(message: Message): void;

    abstract onPlayerJoin(player: SerializedPlayerState);
    abstract onPlayerLeave(player: SerializedPlayerState);
    abstract receiveState(state: SerializedGameState): void;
}
