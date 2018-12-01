// @flow
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import React, { Component } from 'react';

import { type SignUpAction, signupRequest } from './actions';
import SignUp from './components/SignUp';

type Props = {
    dispatch: SignUpAction => any,
    isAuthenticated: boolean,
};

export class SignUpPage extends Component<Props> {
    render() {
        const { dispatch, isAuthenticated } = this.props;

        return (
            <div className="App">
                {!isAuthenticated && <SignUp onSignUpClick={creds => dispatch(signupRequest(creds))} />}
                {isAuthenticated && <Redirect to="/" />}
            </div>
        );
    }
}

const mapStateToProps = state => ({ isAuthenticated: state.auth.isAuthenticated });

export default connect(mapStateToProps)(SignUpPage);
