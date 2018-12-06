// @flow
import { connect } from 'react-redux';
import React, { Component } from 'react';

import {
    type CardSetType,
    type Dispatch,
    type GameType,
    cardSetCreateRequest,
    gameCreateRequest,
    gameSelectRequest,
} from './actions';
import CardSets from './components/CardSets';
import Games from './components/Games';

type Props = {
    dispatch: Dispatch,
    isAuthenticated: boolean,
    gamelist: Array<GameType>,
    cardsetlist: Array<CardSetType>,
    activeGame: ?number,
};

export class Main extends Component<Props> {
    render() {
        const { dispatch, gamelist, activeGame, cardsetlist, isAuthenticated } = this.props;
        return (
            <div className="App">
                <div className="container">
                    <Games
                        onGameCreate={gamename => dispatch(gameCreateRequest(gamename))}
                        onGameSelect={game_id => dispatch(gameSelectRequest(game_id))}
                        isAuthenticated={isAuthenticated}
                        gamelist={gamelist}
                    />
                    <CardSets
                        onCardSetCreate={cardsetname => dispatch(cardSetCreateRequest(cardsetname, activeGame))}
                        isAuthenticated={isAuthenticated}
                        cardsetlist={cardsetlist}
                        activeGame={activeGame}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        cardsetlist: state.cardsets.cardsetlist,
        gamelist: state.games.gamelist,
        activeGame: state.games.active,
    };
};

export default connect(mapStateToProps)(Main);
