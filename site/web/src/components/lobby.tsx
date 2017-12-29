import * as React from 'react';
import {Route, Link} from 'react-router-dom';
import {RouteComponentProps} from 'react-router';
import {GameDataService} from '../services/dataServices';
import {LobbyNetworkService} from '../services/lobbyNetworkService';
import {ClientLobbyMessage, ClientLobbyUpdateMessage} from '@common/lobby/lobbyMessage';
import {GameModel} from "@common/models/game/gameModel";

interface LobbyProps extends RouteComponentProps<{gameId: string}> {}

interface LobbyState {
    game: GameModel | null;
    lobby: ClientLobbyUpdateMessage | null;
    loadingGame: boolean;
    connectingToLobby: 0 | 1 | 2;
    countdownTimer: number;
}

export class Lobby extends React.Component<LobbyProps, LobbyState> {
    waitTick: number;
    private lobbyNetwork: LobbyNetworkService;

    constructor(props: LobbyProps, context: any) {
        super(props, context);
        this.state = {
            game: null,
            lobby: null,
            connectingToLobby: 0,
            countdownTimer: 0,
            loadingGame: true
        };
    }

    componentWillUnmount() {
        clearInterval(this.waitTick);
    }

    async componentDidMount() {
        const gameResponse = await GameDataService.getGameData(this.props.match.params.gameId);
        this.setState(oldState => ({
            ...oldState,
            loadingGame: false,
            game: gameResponse.body!.game
        }));
        this.lobbyNetwork = new LobbyNetworkService();
        this.lobbyNetwork.connect(
            () => {
                this.setState(oldState => ({
                    ...oldState,
                    connectingToLobby: 1
                }));
                this.lobbyNetwork.sendMessage({
                    type: 'join-lobby',
                    gameId: this.state.game!.gameId
                });
            },
            message => {
                this.processMessage(message);
            }
        );

        this.waitTick = (setInterval(() => {
            if (this.state.lobby && this.state.lobby.startCountdown !== -1) {
                this.forceUpdate();
            }
        }, 1000) as any) as number;
    }

    render() {
        return (
            <div>
                {this.state.loadingGame ? (
                    <span>Loading Game...</span>
                ) : (
                    (this.state.connectingToLobby === 0 && <span>Connecting to lobby</span>) ||
                    (this.state.connectingToLobby === 1 && <span>Joining lobby</span>) ||
                    this.renderLobby()
                )}
            </div>
        );
    }

    private processMessage(message: ClientLobbyMessage) {
        switch (message.type) {
            case 'lobby-update': {
                this.setState(oldState => ({
                    ...oldState,
                    connectingToLobby: 2,
                    lobby: message.lobby,
                    countdownTimer: +new Date()
                }));
                break;
            }
            case 'game-ready': {
                break;
            }
        }
    }

    private renderLobby() {
        let lobby = this.state.lobby!;
        return (
            <div>
                <span>{lobby.gameName}</span>
                <div>
                    <div>
                        {lobby.startCountdown === -1
                            ? 'Waiting For Players'
                            : `Game starting in about ${Math.round(
                                  (lobby.startCountdown - (+new Date() - this.state.countdownTimer)) / 1000
                              )} seconds...`}
                    </div>
                    <div>
                        Players
                        <ul>{lobby.users.map(p => <li key={p.id}>{p.username}</li>)}</ul>
                    </div>
                </div>
            </div>
        );
    }
}
