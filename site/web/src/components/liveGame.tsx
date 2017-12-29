import * as React from 'react';
import {Route, Link} from 'react-router-dom';
import {RouteComponentProps} from 'react-router';
import {GameDataService} from '../services/dataServices';
import {GameModel, LiveGameModel} from '@common/models/game/gameModel';
import {LobbyNetworkService} from '../services/lobbyNetworkService';
import {GameNetworkService} from '../services/gameNetworkService';
import {ClientGameMessage} from '@common/lobby/gameMessage';

interface Props extends RouteComponentProps<{liveGameId: string}> {}

type LoadingSteps = 'start' | 'gotData' | 'connectedToSocket' | 'authSocket' | 'gameLive';

interface State {
    loadingStep: LoadingSteps;
    liveGame: LiveGameModel | null;
}

export class LiveGame extends React.Component<Props, State> {
    private gameNetwork: GameNetworkService;

    constructor(props: Props, context: any) {
        super(props, context);
        this.state = {
            loadingStep: 'start',
            liveGame: null
        };
    }

    async componentDidMount() {
        const gameResponse = await GameDataService.getLiveGameData(this.props.match.params.liveGameId);
        if (!gameResponse.success) {
            window.location.replace('https://quickga.me/');
            return;
        }
        this.setState(oldState => ({
            ...oldState,
            loadingStep: 'gotData',
            liveGame: gameResponse.body!.liveGame
        }));

        this.gameNetwork = new GameNetworkService();
        this.gameNetwork.connect(
            gameResponse.body!.liveGame.gameServerAddress,
            () => {
                this.setState(oldState => ({
                    ...oldState,
                    loadingStep: 'connectedToSocket'
                }));
                this.gameNetwork.sendMessage({
                    type: 'join-game',
                    gameId: gameResponse.body!.liveGame.gameId
                });
            },
            message => {
                this.processMessage(message);
            }
        );
    }

    private processMessage(message: ClientGameMessage) {
        switch (message.type) {
            case 'user-authorized': {
                this.setState(oldState => ({
                    ...oldState,
                    loadingStep: 'authSocket'
                }));
                break;
            }

            case 'game-starting': {
                this.setState(oldState => ({
                    ...oldState,
                    loadingStep: 'gameLive'
                }));
                break;
            }
        }
    }

    render() {
        return <div>{this.switchStatus(this.state.loadingStep, () => <div>Game Ready</div>)}</div>;
    }

    private switchStatus(loadingStep: LoadingSteps, resolve: () => any) {
        console.log(loadingStep);
        return (
            (loadingStep === 'start' && <span>Loading Game...</span>) ||
            (loadingStep === 'gotData' && <span>Connecting To Server...</span>) ||
            (loadingStep === 'connectedToSocket' && <span>Authorizing Server...</span>) ||
            (loadingStep === 'authSocket' && <span>Waiting For Game To Start...</span>) ||
            (loadingStep === 'gameLive' && resolve())
        );
    }
}
