// @flow
import './App.css';

import { connect } from 'react-redux';
import React, { Component } from 'react';

import type { GameType, Action } from './reducers';
import { gameCreateRequest, initRequest } from './actions';
import Games from './components/Games';
import Navbar from './components/Navbar';

type Props = {
    dispatch: Action => any,
    isAuthenticated: boolean,
    gamelist: Array<GameType>,
};

export class AppComponent extends Component<Props> {
    componentDidMount() {
        this.props.dispatch(initRequest());
    }

    render() {
        const { dispatch, gamelist, isAuthenticated } = this.props;
        return (
            <div className="App">
                <Navbar isAuthenticated={isAuthenticated} />
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

export default connect(mapStateToProps)(AppComponent);
