// @flow
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import React, { Component } from 'react';

import { type Dispatch, loginRequest } from './actions';
import Login from './components/Login';

type Props = {
    dispatch: Dispatch,
    isAuthenticated: boolean,
};

export class LoginPage extends Component<Props> {
    render() {
        const { dispatch, isAuthenticated } = this.props;

        return (
            <div className="App">
                {!isAuthenticated && (
                    <Login onLogin={creds => dispatch(loginRequest(creds))} />
                )}
                {isAuthenticated && <Redirect to="/" />}
            </div>
        );
    }
}

const mapStateToProps = state => ({ isAuthenticated: state.auth.isAuthenticated });

export default connect(mapStateToProps)(LoginPage);
