// @flow
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import React, { Component } from 'react';

import { type Dispatch, type GamesCollection, type IdsArray, gameCreateRequest } from '../actions';

type Props = {
    dispatch: Dispatch,
    isAuthenticated: boolean,
    allIds: IdsArray,
    byId: GamesCollection,
};

export class Games extends Component<Props> {
    handleCreateGameClick(event: SyntheticEvent<>) {
        const { dispatch } = this.props;

        const gamename = this.refs.gamename;
        dispatch(gameCreateRequest(gamename.value.trim()));
    }

    render() {
        const { isAuthenticated, allIds, byId } = this.props;

        const gameItems = allIds.map(game_id => byId[game_id]).map(game => (
            <li key={game.id}>
                <Link to={`/game/${game.id}`}>{game.name}</Link>
            </li>
        ));

        return (
            isAuthenticated && (
                <div>
                    <ul>{gameItems}</ul>
                    <div>
                        <input type="text" ref="gamename" className="form-control" placeholder="Game name" />
                        <button onClick={event => this.handleCreateGameClick(event)}>Create Game</button>
                    </div>
                </div>
            )
        );
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        allIds: state.games.allIds,
        byId: state.games.byId,
    };
};

export default connect(mapStateToProps)(Games);
