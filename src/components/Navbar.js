// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Login from './Login.js';
import Logout from './Logout.js';
import { loginUser, logoutUser } from '../actions';

type Props = {
    loginUser: ({ username: string, password: string }) => void,
    logoutUser: () => void,
    isAuthenticated: boolean,
    errorMessage: string,
};

class Navbar extends Component<Props> {
    render() {
        const {
            loginUser,
            logoutUser,
            isAuthenticated,
            errorMessage,
        } = this.props;

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
                                onLoginClick={creds => loginUser(creds)}
                            />
                        )}

                        {isAuthenticated && (
                            <div>
                                <Logout onLogoutClick={() => logoutUser()} />
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

const mapDispatchToProps = dispatch => {
    return {
        loginUser: creds => {
            dispatch(loginUser(creds));
        },
        logoutUser: () => {
            dispatch(logoutUser());
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Navbar);
