// @flow
import React, { Component } from 'react';
import Login from './Login.js';
import Logout from './Logout.js';
import { loginUser, logoutUser } from '../actions';

type Props = {
    dispatch: string => void,
    isAuthenticated: boolean,
    errorMessage: string
};

export default class Navbar extends Component<Props> {
    render() {
        const { dispatch, isAuthenticated, errorMessage } = this.props;

        return (
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/#">
                        Cardamon
                    </a>
                    <div className="navbar-form">
                        {!isAuthenticated && (
                            <Login
                                errorMessage={errorMessage}
                                onLoginClick={creds =>
                                    dispatch(loginUser(creds))
                                }
                            />
                        )}

                        {isAuthenticated && (
                            <div>
                                <Logout
                                    onLogoutClick={() => dispatch(logoutUser())}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        );
    }
}
