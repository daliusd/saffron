import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import React, { Component } from 'react';

import { Dispatch, GamesCollection, IdsArray, gameCreateRequest, messageRequest } from '../actions';
import { State } from '../reducers';

interface Props {
    dispatch: Dispatch;
    isAuthenticated: boolean;
    allIds: IdsArray;
    byId: GamesCollection;
}

interface LocalState {
    gameName: string;
}

export class Games extends Component<Props, LocalState> {
    state: LocalState = {
        gameName: '',
    };

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ gameName: event.target.value });
    };

    handleCreateGameClick = () => {
        const { dispatch } = this.props;

        const gamename = this.state.gameName.trim();
        if (gamename) {
            dispatch(gameCreateRequest(gamename));
        } else {
            dispatch(messageRequest('error', 'Game name should be non empty.'));
        }
    };

    render() {
        const { isAuthenticated, allIds, byId } = this.props;

        const gameItems = allIds
            .map(gameId => byId[gameId])
            .map(game => (
                <li key={game.id}>
                    <Link to={`/game/${game.id}`}>{game.name}</Link>
                </li>
            ));

        return (
            isAuthenticated && (
                <div>
                    <ul>{gameItems}</ul>
                    <div>
                        <input
                            type="text"
                            onChange={this.handleChange}
                            className="form-control"
                            placeholder="Game name"
                        />
                        <button onClick={this.handleCreateGameClick}>Create Game</button>
                    </div>
                </div>
            )
        );
    }
}

const mapStateToProps = (state: State) => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        allIds: state.games.allIds,
        byId: state.games.byId,
    };
};

export default connect(mapStateToProps)(Games);
