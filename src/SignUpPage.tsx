import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import React, { Component } from 'react';

import { Dispatch, signupRequest } from './actions';
import { State } from './reducers';
import SignUp from './components/SignUp';

interface Props {
    dispatch: Dispatch;
    isAuthenticated: boolean;
}

export class SignUpPage extends Component<Props> {
    render() {
        const { dispatch, isAuthenticated } = this.props;

        return (
            <div className="App">
                {!isAuthenticated && <SignUp onSignUp={creds => dispatch(signupRequest(creds))} />}
                {isAuthenticated && <Redirect to="/" />}
            </div>
        );
    }
}

const mapStateToProps = (state: State) => ({ isAuthenticated: state.auth.isAuthenticated });

export default connect(mapStateToProps)(SignUpPage);
