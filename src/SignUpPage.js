// @flow
import { connect } from 'react-redux';
import React, { Component } from 'react';

import type { Action } from './reducers';
import { signupRequest } from './actions';
import SignUp from './components/SignUp';

type Props = {
    dispatch: Action => any,
};

export class SignUpPage extends Component<Props> {
    render() {
        const { dispatch } = this.props;
        const errorMessage = ''; // FIXME

        return (
            <div className="App">
                <SignUp onSignUpClick={creds => dispatch(signupRequest(creds))} errorMessage={errorMessage} />
            </div>
        );
    }
}

export default connect()(SignUpPage);
