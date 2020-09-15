export const Lobby = 1;
/*
import {Server} from 'ws';
import {DBGame} from '@serverCommon/db/models/dbGame';
import {GameConfig} from '@common/models/game/gameConfig';
import {ClientLobbyMessage, ServerLobbyMessage} from '@common/lobby/lobbyMessage';
import {UserModel} from '@common/models/user/userModel';
import {DBLiveGame} from '@serverCommon/db/models/dbLiveGame';
import {PubSub} from '@serverCommon/pubSub';
import {NewGameRequest, NewGameResponse} from '@serverCommon/models/redis/newGameModel';
import {UserUtils} from '@serverCommon/models/utils/userUtils';
import {Utils} from '@common/utils';

interface UserSocket {
    user: UserModel;
    socket: {send: (data: any) => void};
}

export interface LobbyGame {
    started: boolean;
    startTimerFinish: number;
    startTimer: number;
    gameId: string;
    gameName: string;
    config: GameConfig;
    users: UserSocket[];
}

export class LobbyServer {
    users: UserSocket[] = [];
    games: {[gameId: string]: LobbyGame} = {};

    constructor(port: number) {
        const wss = new Server({port: port});
        //todo load balance lobby

        wss.on('connection', (ws, req) => {
            let jwt = req.url!.replace('/?jwt=', '');
            let userModel = UserUtils.verifyUser(jwt, () => {
                ws.send('401');
                ws.close();
            });

            if (!userModel) return;

            ws.binaryType = 'arraybuffer';
            const user = {
                user: userModel,
                socket: ws,
            } as UserSocket;

            this.users.push(user);
            ws.on('message', async (m: string) => {
                try {
                    await this.processMessage(user, JSON.parse(m) as ServerLobbyMessage);
                } catch (ex) {
                    console.error(ex);
                }
            });
            ws.on('error', async () => {
                await this.userLeft(user);
            });

            ws.on('close', async () => {
                await this.userLeft(user);
            });
        });
    }

    private async userLeft(user: UserSocket) {
        this.users.splice(this.users.indexOf(user), 1);

        for (let gameId in this.games) {
            let ind = this.games[gameId].users.indexOf(user);
            if (ind >= 0) {
                await this.removeUserFromGame(this.games[gameId], user);
            }
        }
    }

    private async processMessage(user: UserSocket, message: ServerLobbyMessage) {
        switch (message.type) {
            case 'join-lobby':
                if (!this.games[message.gameId]) {
                    await this.createGame(message.gameId);
                }
                await this.addUserToGame(this.games[message.gameId], user);
                break;
        }
    }

    private async addUserToGame(game: LobbyGame, user: UserSocket) {
        if (game.users.find((a) => a.user.id == user.user.id)) {
            return;
        }
        game.users.push(user);
        await this.processGameLogic(game);
    }

    private async removeUserFromGame(game: LobbyGame, user: UserSocket) {
        game.users.splice(game.users.indexOf(user), 1);
        await this.processGameLogic(game);
    }

    private async createGame(gameId: string) {
        const game = await DBGame.db.getById(gameId);
        if (game && game.gameConfig!.hasLobby) {
            this.games[gameId] = {
                gameId: gameId,
                gameName: game.gameName,
                config: game.gameConfig!,
                users: [],
                startTimer: -1,
                startTimerFinish: -1,
                started: false,
            };
        } else {
            throw 'Game Not Found ' + gameId;
        }
    }

    private async processGameLogic(game: LobbyGame) {
        let config = game.config;
        if (game.started) return;

        if (game.users.length === 0) {
            delete this.games[game.gameId];
            return;
        }

        if (game.users.length === config.lobbyRules.maxPlayers) {
            if (game.startTimer !== -1) {
                clearTimeout(game.startTimer);
            }
            this.startGame(game);
        } else if (game.users.length < config.lobbyRules.minPlayers) {
            if (game.startTimer !== -1) {
                clearTimeout(game.startTimer);
            }
            game.startTimer = -1;
            game.startTimerFinish = -1;
        } else {
            if (game.startTimer !== -1) {
                clearTimeout(game.startTimer);
            }
            game.startTimerFinish = +new Date() + config.lobbyRules.waitSecondsForPlayers * 1000;
            game.startTimer = <number>(<any>setTimeout(async () => {
                this.startGame(game);
            }, config.lobbyRules.waitSecondsForPlayers * 1000));
        }

        await this.sendGameMessage(game, {
            type: 'lobby-update',
            lobby: {
                gameName: game.gameName,
                startCountdown:
                    game.startTimerFinish === -1 ? game.startTimerFinish : game.startTimerFinish - +new Date(),
                users: game.users.map((p) => p.user),
            },
        });
    }

    private async sendGameMessage(game: LobbyGame, message: ClientLobbyMessage) {
        for (let user of game.users) {
            try {
                user.socket.send(JSON.stringify(message));
            } catch (ex) {}
        }
    }

    private async startGame(game: LobbyGame) {
        game.started = true;
        let liveGame = new DBLiveGame();
        liveGame.gameId = game.gameId;
        liveGame.users = game.users.map((a) => a.user);
        liveGame = await DBLiveGame.db.insertDocument(liveGame);

        let newGameResponse = await PubSub.pushAndWait<NewGameRequest, NewGameResponse>('new-game', {
            messageId: Utils.guid(),
            liveGameId: liveGame._id.toHexString(),
            lobbyId: PubSub.id,
        });

        await this.sendGameMessage(game, {
            type: 'game-ready',
            liveGameId: liveGame._id.toHexString(),
            gameServerAddress: newGameResponse.gameServerAddress,
        });
        delete this.games[game.gameId];
    }
}
*/
