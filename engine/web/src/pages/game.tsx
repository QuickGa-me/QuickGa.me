import * as React from 'react';
import {Route, Link} from 'react-router-dom';
import {RouteComponentProps} from 'react-router';
import {GameDataService} from '../services/dataServices';
import {GameModel} from '@common/models/game/gameModel';

interface Props extends RouteComponentProps<{gameId: string}> {}

interface State {
    game: GameModel | null;
    loadingGame: boolean;
}

export class Game extends React.Component<Props, State> {
    constructor(props: Props, context: any) {
        super(props, context);
        this.state = {
            game: null,
            loadingGame: true
        };
    }

    async componentDidMount() {
        const gameResponse = await GameDataService.getGameData(this.props.match.params.gameId);
        this.setState(oldState => ({
            ...oldState,
            loadingGame: false,
            game: gameResponse.body!.game
        }));
    }

    render() {
        return (
            <div>
                {this.state.loadingGame ? (
                    <span>Loading Game...</span>
                ) : (
                    <span>
                        {this.state.game!.gameId} - {this.state.game!.gameName}
                    </span>
                )}
            </div>
        );
    }
}
