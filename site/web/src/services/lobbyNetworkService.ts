import {ClientLobbyMessage, ServerLobbyMessage} from '@common/lobby/lobbyMessage';

export class LobbyNetworkService {
    private socket: WebSocket;

    constructor() {}

    connect(onJoin: () => void, onMessage: (message: ClientLobbyMessage) => void) {
        this.socket = new WebSocket('ws://localhost:7898');
        // this. socket = new WebSocket('ws://ec2-34-211-236-203.us-west-2.compute.amazonaws.com:7898');
        this.socket.binaryType = 'arraybuffer';
        this.socket.onopen = () => {
            onJoin();
        };
        this.socket.onmessage = m => {
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
