import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import React, { Component } from 'react';

import { Dispatch, gameCreateRequest, gameDeleteRequest, messageDisplay } from '../actions';
import { GamesCollection, IdsArray } from '../types';
import { State } from '../reducers';
import ConfirmedDelete from './ConfirmedDelete';
import KawaiiMessage, { Character } from './KawaiiMessage';

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
            dispatch(messageDisplay('error', 'Game name should be non empty.'));
        }
    };

    handleGameDelete = (gameId: string) => {
        const { dispatch } = this.props;
        dispatch(gameDeleteRequest(gameId));
    };

    render() {
        const { isAuthenticated, allIds, byId } = this.props;

        const gameItems = allIds
            .map(gameId => byId[gameId])
            .map(game => (
                <li key={game.id}>
                    <Link to={`/game/${game.id}`}>{game.name}</Link>{' '}
                    <ConfirmedDelete
                        question="Do you really want to delete this game?"
                        onDelete={() => this.handleGameDelete(game.id)}
                    />
                </li>
            ));

        return (
            isAuthenticated && (
                <div>
                    <KawaiiMessage character={Character.Ghost}>
                        {allIds.length === 0 && (
                            <>Here you can create your games and see list of your games when you have some.</>
                        )}
                        {allIds.length > 0 && (
                            <>Here you can see a list of your games or you can create even more games.</>
                        )}
                    </KawaiiMessage>

                    <ul>{gameItems}</ul>
                    <div className="form">
                        <label htmlFor="game_name">Game name:</label>
                        <input
                            id="game_name"
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
