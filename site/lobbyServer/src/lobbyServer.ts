import {Server} from 'ws';
import {DBGame} from '@serverCommon/db/models/game';
import {GameConfig} from '@common/models/game/gameConfig';
import {ClientLobbyMessage, ServerLobbyMessage} from '@common/lobby/lobbyMessage';

export interface PlayerSocket {
    player: {
        playerId: string;
        avatar: string;
        name: string;
        color: string;
    } | null;
    socket: {send: (data: any) => void};
}

export interface LobbyGame {
    startTimerFinish: number;
    startTimer: number;
    gameId: string;
    gameName: string;
    config: GameConfig;
    players: PlayerSocket[];
}

export class LobbyServer {
    players: PlayerSocket[] = [];
    games: {[gameId: string]: LobbyGame} = {};

    constructor(port: number) {
        const wss = new Server({port: port});

        //todo load balance lobby

        wss.on('connection', (ws, req) => {
            let auth = req.headers['Authorization'];
            //todo add player auth here

            ws.binaryType = 'arraybuffer';
            const player = {
                player: {
                    name: ((Math.random() * 100000) | 0).toString(),
                    playerId: ((Math.random() * 100000) | 0).toString()
                } as any,
                currentGameId: null,
                socket: ws
            };

            this.players.push(player);
            ws.on('message', async (m: string) => {
                try {
                    await this.processMessage(player, JSON.parse(m) as ServerLobbyMessage);
                } catch (ex) {
                    console.error(ex);
                }
            });
            ws.on('error', async () => {
                await this.playerLeft(player);
            });

            ws.on('close', async () => {
                await this.playerLeft(player);
            });
        });
    }

    private async playerLeft(player: PlayerSocket) {
        this.players.splice(this.players.indexOf(player), 1);

        for (let gameId in this.games) {
            let ind = this.games[gameId].players.indexOf(player);
            if (ind >= 0) {
                await this.removePlayerFromGame(this.games[gameId], player);
            }
        }
    }

    private async processMessage(player: PlayerSocket, message: ServerLobbyMessage) {
        switch (message.type) {
            case 'join-lobby':
                if (!this.games[message.gameId]) {
                    await this.createGame(message.gameId);
                }
                await this.addPlayerToGame(this.games[message.gameId], player);
                break;
        }
    }

    private async addPlayerToGame(game: LobbyGame, player: PlayerSocket) {
        if (game.players.find(a => a.player!.playerId == player.player!.playerId)) {
            return;
        }
        game.players.push(player);
        await this.processGameLogic(game);
    }

    private async removePlayerFromGame(game: LobbyGame, player: PlayerSocket) {
        game.players.splice(game.players.indexOf(player), 1);
        await this.processGameLogic(game);
    }

    private async createGame(gameId: string) {
        const game = await DBGame.db.getById(gameId);
        if (game && game.gameConfig!.hasLobby) {
            this.games[gameId] = {
                gameId: gameId,
                gameName: game.gameName,
                config: game.gameConfig!,
                players: [],
                startTimer: -1,
                startTimerFinish: -1
            };
        } else {
            throw 'Game Not Found ' + gameId;
        }
    }

    private async processGameLogic(game: LobbyGame) {
        let config = game.config;

        if (game.players.length === 0) {
            delete this.games[game.gameId];
            return;
        }

        if (game.players.length === config.lobbyRules.maxPlayers) {
            if (game.startTimer !== -1) {
                clearTimeout(game.startTimer);
            }
            await this.startGame(game);
        } else if (game.players.length < config.lobbyRules.minPlayers) {
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
                await this.startGame(game);
            }, config.lobbyRules.waitSecondsForPlayers * 1000));
        }

        await this.sendGameMessage(game, {
            type: 'lobby-update',
            lobby: {
                gameName: game.gameName,
                startCountdown:
                    game.startTimerFinish === -1 ? game.startTimerFinish : game.startTimerFinish - +new Date(),
                players: game.players.map(p => p.player!)
            }
        });
    }

    private async sendGameMessage(game: LobbyGame, message: ClientLobbyMessage) {
        for (let player of game.players) {
            try {
                player.socket.send(JSON.stringify(message));
            } catch (ex) {}
        }
    }

    private async startGame(game: LobbyGame) {
        //todo find game server
        await this.sendGameMessage(game, {
            type: 'game-ready'
        });
    }
}
