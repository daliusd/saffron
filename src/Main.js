// @flow
import { connect } from 'react-redux';
import React, { Component } from 'react';

import { type Dispatch, type GameType, gameCreateRequest } from './actions';
import Games from './components/Games';

type Props = {
    dispatch: Dispatch,
    isAuthenticated: boolean,
    gamelist: Array<GameType>,
};

export class Main extends Component<Props> {
    render() {
        const { dispatch, gamelist, isAuthenticated } = this.props;
        return (
            <div className="App">
                <div className="container">
                    <Games
                        onGameCreate={gamename => dispatch(gameCreateRequest(gamename))}
                        isAuthenticated={isAuthenticated}
                        gamelist={gamelist}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { games, auth } = state;
    const { gamelist } = games;
    const { isAuthenticated } = auth;

    return {
        gamelist,
        isAuthenticated,
    };
};

export default connect(mapStateToProps)(Main);
