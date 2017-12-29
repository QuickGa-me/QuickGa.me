import {Server} from 'ws';

export class GameServer {
    constructor(port: number) {
        const wss = new Server({port: port});
        wss.on('connection', (ws, req) => {
            let auth = req.headers['Authorization'];
            //todo add player auth here

            ws.binaryType = 'arraybuffer';
            ws.on('message', async (m: string) => {
                try {
                } catch (ex) {
                    console.error(ex);
                }
            });
            ws.on('error', async () => {});

            ws.on('close', async () => {});
        });
    }
}
