import {Server} from 'ws';
import {PubSub} from '@serverCommon/pubSub';
import {NewGameRequest, NewGameResponse} from '@serverCommon/models/redis/newGameModel';
import {DBLiveGame} from '@serverCommon/db/models/dbLiveGame';
import {DBGame} from '@serverCommon/db/models/dbGame';
import {DBUser} from '@serverCommon/db/models/dbUser';
import {QGServer} from '@framework/index';
import {Config} from '@serverCommon/config';
import {UserUtils} from '@serverCommon/models/utils/userUtils';
import {UserModel} from '@common/models/user/userModel';
import {ClientGameMessage, ServerGameMessage} from '@common/lobby/gameMessage';

interface User {
    user: UserModel;
    connected: boolean;
    joined: boolean;
    socket?: { send: (data: any) => void; close: () => void };
}

interface Game {
    gameServerAddress: string;
    started: boolean;
    dbGame: DBGame;
    liveGameId: string;
    gameId: string;
    server: QGServer;
    users: User[];
}

export class GameServer {
    private games: Game[] = [];

    constructor(private port: number) {
        PubSub.blockingPop<NewGameRequest>('new-game', async result => {
            console.log('creating new game');
            const newGame = await this.createNewGame(result.liveGameId);
            console.log('sending new game back to lobby ', result.lobbyId);
            PubSub.push<NewGameResponse>(result.lobbyId, {
                messageId: result.messageId,
                liveGameId: result.liveGameId,
                gameServerAddress: newGame.gameServerAddress
            });
        });
        console.log('socket started');
        const wss = new Server({port: port});
        console.log('socket open');
        wss.on('error',()=>{
            console.log('ws error1',arguments);
            console.log('ws error2',JSON.stringify(arguments));
        });
        wss.on('connection', (ws, req) => {
            console.log('new connection', req.url);
            let jwt = req.url!.replace('/?jwt=', '');
            let userModel = UserUtils.verifyUser(jwt, () => {
                ws.send('401');
                ws.close();
            });

            if (!userModel) return;
            let foundUser: User | undefined = undefined;
            let foundGame: Game | undefined = undefined;

            for (let game of this.games) {
                for (let user of game.users) {
                    if (user.user.id === userModel.id) {
                        user.connected = true;
                        user.socket = ws;
                        foundUser = user;
                        foundGame = game;
                    }
                }
            }
            if (foundUser === undefined) {
                ws.send('401');
                ws.close();
                return;
            }
            console.log('user connected ' + foundUser.user.username);

            ws.binaryType = 'arraybuffer';

            ws.on('message', async (m: string) => {
                try {
                    await this.processMessage(foundGame!, foundUser!, JSON.parse(m) as ServerGameMessage);
                } catch (ex) {
                    console.error(ex);
                }
            });
            ws.on('error', async () => {
            });

            ws.on('close', async () => {
            });
        });
    }

    private async createNewGame(liveGameId: string): Promise<Game> {
        'use strict';
        const dbLiveGame = await DBLiveGame.db.getById(liveGameId);
        const dbGame = await DBGame.db.getById(dbLiveGame.gameId);
        let serverCode = eval(dbGame.serverSource!);
        let game: Game = {
            gameServerAddress: Config.env === 'DEV' ? `ws://localhost:${this.port}` : 'wss://game.quickga.me',
            dbGame: dbGame,
            gameId: dbGame._id.toHexString(),
            liveGameId: liveGameId,
            started: false,
            users: await Promise.all(
                dbLiveGame.users.map(async u => ({
                    user: DBUser.toUserModel(await DBUser.db.getById(u.id)),
                    connected: false,
                    joined: false
                }))
            ),
            server: new serverCode['default']({logicTickInterval: -1})
        };
        dbLiveGame.gameServerAddress = game.gameServerAddress;
        await DBLiveGame.db.updateDocument(dbLiveGame);
        this.games.push(game);
        console.log('game created');

        return game;
    }

    private async processMessage(game: Game, user: User, message: ServerGameMessage) {
        switch (message.type) {
            case 'join-game':
                if (game.gameId !== message.gameId) {
                    this.bootUser(game, user);
                    return;
                }
                console.log('user joined');

                user.joined = true;
                await this.sendUserMessage(user, {type: 'user-authorized'});
                await this.tryStartGame(game);
                break;
        }
    }

    private async tryStartGame(game: Game) {
        let ready = true;
        for (let user of game.users) {
            if (!user.connected || !user.joined) {
                ready = false;
            }
        }
        console.log('trying start game', ready);
        if (ready) {
            game.started = true;
            await this.sendGameMessage(game, {type: 'game-starting'});
            console.log('game starting');

            /*todo process game logic*/
        }
    }

    private async sendGameMessage(game: Game, message: ClientGameMessage) {
        for (let user of game.users) {
            try {
                user.socket!.send(JSON.stringify(message));
            } catch (ex) {
            }
        }
    }

    private async sendUserMessage(user: User, message: ClientGameMessage) {
        try {
            user.socket!.send(JSON.stringify(message));
        } catch (ex) {
        }
    }

    private bootUser(game: Game, user: User) {
        user.socket!.send('401');
        user.socket!.close();
        game.users.splice(game.users.indexOf(user), 1);
    }
}
