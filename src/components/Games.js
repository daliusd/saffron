// @flow
import { connect } from 'react-redux';
import React, { Component } from 'react';

import { type Dispatch, type GameType, gameCreateRequest, gameSelectRequest } from '../actions';

type Props = {
    dispatch: Dispatch,
    isAuthenticated: boolean,
    gamelist: Array<GameType>,
};

export class Games extends Component<Props> {
    handleCreateGameClick(event: SyntheticEvent<>) {
        const { dispatch } = this.props;

        const gamename = this.refs.gamename;
        dispatch(gameCreateRequest(gamename.value.trim()));
    }

    handleGameSelect(event: SyntheticEvent<>, game_id: number) {
        const { dispatch } = this.props;

        dispatch(gameSelectRequest(game_id));
    }

    render() {
        const { isAuthenticated, gamelist } = this.props;

        const gameItems = gamelist.map(game => (
            <li key={game.id.toString()} onClick={event => this.handleGameSelect(event, game.id)}>
                {game.name}
            </li>
        ));

        return (
            isAuthenticated && (
                <div>
                    <div>
                        <input type="text" ref="gamename" className="form-control" placeholder="Game name" />
                        <button onClick={event => this.handleCreateGameClick(event)}>Create Game</button>
                    </div>
                    <ul>{gameItems}</ul>
                </div>
            )
        );
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        gamelist: state.games.gamelist,
    };
};

export default connect(mapStateToProps)(Games);
