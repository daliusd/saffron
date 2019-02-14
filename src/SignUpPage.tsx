import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import React, { Component } from 'react';

import { Dispatch, signupRequest } from './actions';
import { State } from './reducers';
import KawaiiMessage, { Character } from './components/KawaiiMessage';
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
                {!isAuthenticated && (
                    <>
                        <KawaiiMessage character={Character.Ghost}>
                            Create your user here. Instead of user name you can use your e-mail. If you forget your
                            password then you can send me e-mail (I will not send you any e-mails without your consent).
                            If you use regular user name and forget your password then you will not be able to access
                            your account.
                        </KawaiiMessage>

                        <SignUp onSignUp={creds => dispatch(signupRequest(creds))} />
                    </>
                )}
                {isAuthenticated && <Redirect to="/" />}
            </div>
        );
    }
}

const mapStateToProps = (state: State) => ({ isAuthenticated: state.auth.isAuthenticated });

export default connect(mapStateToProps)(SignUpPage);
