import {ClientLobbyMessage, ServerLobbyMessage} from '@common/lobby/lobbyMessage';
import {Config} from '../config';
import {StorageService} from './storageService';

export class LobbyNetworkService {
    private socket: WebSocket;

    constructor() {}

    connect(onJoin: () => void, onMessage: (message: ClientLobbyMessage) => void) {
        this.socket = new WebSocket(`${Config.websocketUrl}?jwt=${StorageService.jwt}`);
        this.socket.binaryType = 'arraybuffer';
        this.socket.onopen = () => {
            onJoin();
        };
        this.socket.onmessage = m => {
            if (m.data === '401') {
                window.location.replace('https://quickga.me');
                return;
            }
            onMessage(JSON.parse(m.data) as ClientLobbyMessage);
        };
    }

    sendMessage(message: ServerLobbyMessage) {
        this.socket.send(JSON.stringify(message));
    }

    disconnect() {
        this.socket.close();
    }
}
