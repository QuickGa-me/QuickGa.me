import * as React from 'react';
import {Route, Link} from 'react-router-dom';
import {RouteComponentProps} from 'react-router';
import {GameModel} from '@common/models/http/gameController';
import {GameDataService} from '../services/dataServices';

interface HomeProps extends RouteComponentProps<{}> {}

interface HomeState {
    games: GameModel[];
    loadingGames: boolean;
}

export class Home extends React.Component<HomeProps, HomeState> {
    constructor(props: HomeProps, context: any) {
        super(props, context);
        this.state = {
            games: [],
            loadingGames: true
        };
    }

    async componentDidMount() {
        const gameResponse = await GameDataService.getAllGames();
        this.setState(oldState => ({
            ...oldState,
            loadingGames: false,
            games: gameResponse.body!.games
        }));
    }

    render() {
        return (
            <div>
                <h1>Quick Game</h1>
                {this.state.loadingGames ? (
                    <span>Loading...</span>
                ) : (
                    this.state.games.map(game => (
                        <div key={game.gameId}>
                            {game.gameId} - {game.gameName} <Link to={this.getGamePath(game)}>Play</Link>
                        </div>
                    ))
                )}
            </div>
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
