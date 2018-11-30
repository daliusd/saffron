// @flow
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import React, { Component } from 'react';

import type { LoginAction } from './reducers';
import { loginRequest } from './actions';
import Login from './components/Login';

type Props = {
    dispatch: LoginAction => any,
    isAuthenticated: boolean,
};

export class LoginPage extends Component<Props> {
    render() {
        const { dispatch, isAuthenticated } = this.props;
        const errorMessage = ''; // FIXME

        return (
            <div className="App">
                {!isAuthenticated && (
                    <Login errorMessage={errorMessage} onLoginClick={creds => dispatch(loginRequest(creds))} />
                )}
                {isAuthenticated && <Redirect to="/" />}
            </div>
        );
    }
}

const mapStateToProps = state => ({ isAuthenticated: state.auth.isAuthenticated });

export default connect(mapStateToProps)(LoginPage);
