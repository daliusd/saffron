// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Login from './Login.js';
import Logout from './Logout.js';
import LoginAction from '../reducers';

type Props = {
    dispatch: LoginAction => any,
    isAuthenticated: boolean,
    errorMessage: string,
};

class Navbar extends Component<Props> {
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
                                    dispatch({ type: 'LOGIN_REQUEST', creds })
                                }
                            />
                        )}

                        {isAuthenticated && (
                            <div>
                                <Logout
                                    onLogoutClick={() =>
                                        dispatch({ type: 'LOGOUT_REQUEST' })
                                    }
                                />
                            </div>
                        )}
                    </div>
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

export default connect(mapStateToProps)(Navbar);
