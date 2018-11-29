// @flow
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import React, { Component } from 'react';

import type { LoginAction } from '../reducers';
import { logoutRequest } from '../actions';
import Logout from './Logout.js';

type Props = {
    dispatch: LoginAction => any,
    isAuthenticated: boolean,
};

export class Navbar extends Component<Props> {
    render() {
        const { dispatch, isAuthenticated } = this.props;

        return (
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <h1>
                        <Link to="/">Cardamon</Link>
                    </h1>
                    <div>
                        {isAuthenticated && (
                            <div>
                                <Logout onLogoutClick={() => dispatch(logoutRequest())} />
                            </div>
                        )}
                    </div>
                    <div>{!isAuthenticated && <Link to="/login">Login</Link>}</div>
                    <div>{!isAuthenticated && <Link to="/signup">Sign-up</Link>}</div>
                </div>
            </nav>
        );
    }
}

const mapStateToProps = state => {
    const { auth } = state;
    const { isAuthenticated } = auth;

    return {
        isAuthenticated,
    };
};

export default connect(mapStateToProps)(Navbar);
