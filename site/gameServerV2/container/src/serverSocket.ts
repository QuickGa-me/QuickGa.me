import * as WebServer from 'ws';
import * as url from 'url';
import {createServer} from 'http';
import {IServerSocket, ServerSocketOptions, SocketConnection} from './models';
// import {AuthService} from '../../../webServer/src/modules/auth/auth.service';
import {ArrayHash} from './arrayHash';
import {nextId} from './uuid';
import {ServerUtils} from './serverUtils';

export class ServerSocket implements IServerSocket {
  connections = new ArrayHash<SocketConnection>('connectionId');

  time = +new Date();

  totalBytesReceived = 0;
  totalBytesSent = 0;
  wss?: WebServer.Server;
  private serverSocketOptions?: ServerSocketOptions;

  get totalBytesSentPerSecond() {
    return Math.round(this.totalBytesSent / ((+new Date() - this.time) / 1000));
  }

  disconnect(connectionId: number): void {
    const connection = this.connections.lookup(connectionId);
    if (connection) {
      connection.socket.close();
      this.connections.remove(connection);
      console.log('closed: connections', this.connections.length);
      this.serverSocketOptions?.onLeave(connectionId);
    }
  }

  sendMessage(connectionId: number, messages: any[]) {
    const client = this.connections.lookup(connectionId);
    if (!client) {
      return;
    }
    // this.totalBytesSent += body.byteLength;
    // client.socket.send(body);
  }

  start(serverSocketOptions: ServerSocketOptions) {
    this.serverSocketOptions = serverSocketOptions;
    const {onJoin, onLeave, onMessage} = serverSocketOptions;

    const port = 80;
    console.log('port', port);
    const server = createServer(async (req, res) => {
      console.log('req', req.method, req.url);
      if (req.method === 'GET') {
        res.writeHead(200, {
          'Content-Type': 'text/plain',
          'Content-Length': 2,
        });
        res.write('OK');
        res.end();
      }
      if (req.method === 'POST') {
        console.log('stopping');
        await ServerUtils.stop();
        res.writeHead(200, {
          'Content-Type': 'text/plain',
          'Content-Length': 2,
        });
        res.write('OK');
        res.end();
      }
    });

    this.wss = new WebServer.Server({server, noServer: true, perMessageDeflate: false});
    this.wss.on('error', (a: any, b: any) => {
      console.error('error', a, b);
      throw a;
    });

    this.wss.on('connection', (ws, request) => {
      console.log('conn');
      debugger;
      if (!request.url) {
        ws.close();
        return;
      }
      const query = url.parse(request.url).query;
      if (!query) {
        ws.close();
        return;
      }
      const [jwtKey, jwt] = query.split('=');
      if (jwtKey !== 'jwt' || !jwt) {
        ws.close();
        return;
      }

      let jwtUser: SocketConnection['jwt'];
      const jwtResult = true; /*AuthService.validate(jwt)*/
      if (!jwtResult) {
        ws.close();
        return;
      }
      // jwtUser = jwtResult;
      ws.binaryType = 'arraybuffer';
      const me: SocketConnection = {
        socket: ws,
        connectionId: nextId(),
        lastAction: +new Date(),
        lastPing: +new Date(),
        jwt: 1 as any,
      };

      this.connections.push(me);
      const disconnect = () => {
        const connection = this.connections.lookup(me.connectionId);
        if (!connection) {
          return;
        }
        this.connections.remove(connection);
        console.log('closed: connections', this.connections.length);
        onLeave(me.connectionId);
      };
      // console.log('opened: connections', this.connections.length);
      ws.on('message', (message) => {
        console.log(message);
        try {
          if (!(message instanceof ArrayBuffer)) {
            console.log('bad connection');
            ws.close();
            return;
          }
          this.totalBytesReceived += (message as ArrayBuffer).byteLength;
          // const messageData = SchemaDefiner.startReadSchemaBuffer(
          //     message as ArrayBuffer,
          //     ClientToServerSchemaReaderFunction
          // );
          // if (messageData === null) {
          //   ws.close();
          //   return;
          // }
          onMessage(me.connectionId, {});
        } catch (ex) {
          ws.close();
          return;
        }
      });
      ws.on('error', (e) => {
        console.log('errored', e);
        disconnect();
      });

      ws.onclose = () => {
        console.log('close');
        disconnect();
      };
      onJoin(me.connectionId);
    });
    server.listen(port);
  }
}
