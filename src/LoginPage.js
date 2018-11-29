// @flow
import { connect } from 'react-redux';
import React, { Component } from 'react';

import type { LoginAction } from './reducers';
import { loginRequest } from './actions';
import Login from './components/Login';

type Props = {
    dispatch: LoginAction => any,
};

export class LoginPage extends Component<Props> {
    render() {
        const { dispatch } = this.props;
        const errorMessage = ''; // FIXME

        return (
            <div className="App">
                <Login errorMessage={errorMessage} onLoginClick={creds => dispatch(loginRequest(creds))} />
            </div>
        );
    }
}

export default connect()(LoginPage);
