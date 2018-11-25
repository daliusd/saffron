// @flow
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import React, { Component } from 'react';

import { loginRequest, logoutRequest } from '../actions';
import Login from './Login.js';
import LoginAction from '../reducers';
import Logout from './Logout.js';

type Props = {
    dispatch: LoginAction => any,
    isAuthenticated: boolean,
    errorMessage: string,
};

export class NavbarC extends Component<Props> {
    render() {
        const { dispatch, isAuthenticated, errorMessage } = this.props;

        return (
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <h1>
                        <Link to="/">Cardamon</Link>
                    </h1>
                    <div className="navbar-form">
                        {!isAuthenticated && (
                            <Login errorMessage={errorMessage} onLoginClick={creds => dispatch(loginRequest(creds))} />
                        )}

                        {isAuthenticated && (
                            <div>
                                <Logout onLogoutClick={() => dispatch(logoutRequest())} />
                            </div>
                        )}
                    </div>
                    <div>{!isAuthenticated && <Link to="/signup">Sign-up</Link>}</div>
                </div>
            </nav>
        );
    }
}

const mapStateToProps = state => {
    const { auth } = state;
    const { isAuthenticated, errorMessage } = auth;

    return {
        isAuthenticated,
        errorMessage,
    };
};

export default connect(mapStateToProps)(NavbarC);
