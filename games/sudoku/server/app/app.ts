import {Server} from 'ws';
import {Message} from "@common/messages";

export class ServerApp {

    constructor() {
        const wss = new Server({port: 7898});
        console.log('server open');

        wss.on('connection', (ws) => {
            ws.binaryType = "arraybuffer";
            ws.on('message', (m: string) => {
                let message = JSON.parse(m) as Message;
            });

            ws.on('close', () => {
            });
        });
    }


}

new ServerApp();