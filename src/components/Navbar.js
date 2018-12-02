// @flow
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import React, { Component } from 'react';

import { type Dispatch, type MessageType, logoutRequest } from '../actions';
import Logout from './Logout.js';

type Props = {
    dispatch: Dispatch,
    isAuthenticated: boolean,
    messages: Array<MessageType>,
};

export class Navbar extends Component<Props> {
    render() {
        const { dispatch, isAuthenticated, messages } = this.props;

        return (
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <h1>
                        <Link to="/">Cardamon</Link>
                    </h1>
                    <div>
                        {isAuthenticated && (
                            <div>
                                <Logout onLogout={() => dispatch(logoutRequest())} />
                            </div>
                        )}
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
    };
};

export default connect(mapStateToProps)(Navbar);
