// @flow
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import React, { Component } from 'react';

import type { Action } from './reducers';
import { signupRequest } from './actions';
import SignUp from './components/SignUp';

type Props = {
    dispatch: Action => any,
    isAuthenticated: boolean,
};

export class SignUpPage extends Component<Props> {
    render() {
        const { dispatch, isAuthenticated } = this.props;
        const errorMessage = ''; // FIXME

        return (
            <div className="App">
                {!isAuthenticated && (
                    <SignUp onSignUpClick={creds => dispatch(signupRequest(creds))} errorMessage={errorMessage} />
                )}
                {isAuthenticated && <Redirect to="/" />}
            </div>
        );
    }
}

const mapStateToProps = state => ({ isAuthenticated: state.auth.isAuthenticated });

export default connect(mapStateToProps)(SignUpPage);
