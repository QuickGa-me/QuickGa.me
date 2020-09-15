import {StorageService} from './storageService';
import {ClientGameMessage, ServerGameMessage} from '@common/lobby/gameMessage';

export class GameNetworkService {
    private socket: WebSocket;

    constructor() {}

    connect(gameServerAddress: string, onJoin: () => void, onMessage: (message: ClientGameMessage) => void) {
        this.socket = new WebSocket(`${gameServerAddress}?jwt=${StorageService.jwt}`);
        this.socket.binaryType = 'arraybuffer';

        this.socket.onopen = () => {
            onJoin();
        };

        this.socket.onmessage = m => {
            if (m.data === '401') {
                window.location.replace('https://quickga.me');
                return;
            }
            onMessage(JSON.parse(m.data) as ClientGameMessage);
        };
    }

    sendMessage(message: ServerGameMessage) {
        this.socket.send(JSON.stringify(message));
    }

    disconnect() {
        this.socket.close();
    }
}
