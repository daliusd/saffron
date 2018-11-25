// @flow
import { connect } from 'react-redux';
import React, { Component } from 'react';

import type { GameType, Action } from './reducers';
import { gameCreateRequest, initRequest } from './actions';
import Games from './components/Games';

type Props = {
    dispatch: Action => any,
    isAuthenticated: boolean,
    gamelist: Array<GameType>,
};

export class MainComponent extends Component<Props> {
    componentDidMount() {
        this.props.dispatch(initRequest());
    }

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

export default connect(mapStateToProps)(MainComponent);
