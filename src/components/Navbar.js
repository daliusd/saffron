// @flow
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import React, { Component } from 'react';

import { type Dispatch, type GameType, type MessageType, logoutRequest } from '../actions';
import { getActiveGame } from '../selectors';
import Logout from './Logout.js';

type Props = {
    dispatch: Dispatch,
    isAuthenticated: boolean,
    messages: Array<MessageType>,
    activeGame: ?GameType,
};

export class Navbar extends Component<Props> {
    render() {
        const { dispatch, isAuthenticated, messages, activeGame } = this.props;

        return (
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <h1>
                        <Link to="/">Cardamon</Link>
                    </h1>
                    <div>{isAuthenticated && <Logout onLogout={() => dispatch(logoutRequest())} />}</div>
                    <div>{isAuthenticated && <Link to="/">Main</Link>}</div>
                    <div>
                        {isAuthenticated && activeGame && <Link to={`/game/${activeGame.id}`}>{activeGame.name}</Link>}
                    </div>

                    <div>{!isAuthenticated && <Link to="/login">Login</Link>}</div>
                    <div>{!isAuthenticated && <Link to="/signup">Sign-up</Link>}</div>

                    <div>
                        <ul>
                            {messages.map(m => (
                                <li key={m.id}>{m.text}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        messages: state.message.messages,
        activeGame: getActiveGame(state),
    };
};

export default connect(mapStateToProps)(Navbar);
