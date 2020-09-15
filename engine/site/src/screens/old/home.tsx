export const Game = 1;
/*
import * as React from 'react';
import {Link} from 'react-router-dom';
import {RouteComponentProps} from 'react-router';
import {GameDataService, UserDataService} from '../services/dataServices';
import {GameModel} from '@common/models/game/gameModel';
import {StorageService} from '../services/storageService';
import {UserModel} from '@common/models/user/userModel';

interface Props extends RouteComponentProps<{}> {}

interface State {
    games: GameModel[];
    loadingGames: boolean;
    user: UserModel | null;
}

export class Home extends React.Component<Props, State> {
    constructor(props: Props, context: any) {
        super(props, context);
        this.state = {
            games: [],
            loadingGames: true,
            user: null,
        };
    }

    async componentWillMount() {
        if (StorageService.jwt) {
            const user = await UserDataService.getUserDetails();
            this.setState((oldState) => ({
                ...oldState,
                user: user,
            }));
        } else {
            const user = await UserDataService.generateTempUser();
            this.setState((oldState) => ({
                ...oldState,
                user: user,
            }));
        }
    }

    async componentDidMount() {
        const gameResponse = await GameDataService.getAllGames();
        this.setState((oldState) => ({
            ...oldState,
            loadingGames: false,
            games: gameResponse.body!.games,
        }));
    }

    render() {
        return (
            <>
                <h1>Quick Game</h1>
                <h1 style={{position: 'absolute', right: 10, top: 10}}>
                    {this.state.user && this.state.user.username}
                </h1>
                {this.state.loadingGames ? (
                    <span>Loading...</span>
                ) : (
                    this.state.games.map((game) => (
                        <div key={game.gameId}>
                            {game.gameId} - {game.gameName} <Link to={this.getGamePath(game)}>Play</Link>
                        </div>
                    ))
                )}
            </>
        );
    }

    private getGamePath(game: GameModel) {
        if (game.gameConfig.hasLobby) {
            return '/lobby/' + game.gameId;
        } else {
            return '/game/' + game.gameId;
        }
    }
}
*/
