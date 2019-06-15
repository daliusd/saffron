import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import React, { Component } from 'react';

import { Dispatch, loginRequest, messageDisplay } from './actions';
import { State } from './reducers';
import KawaiiMessage, { Character } from './components/KawaiiMessage';
import Login from './components/Login';

interface Props {
    dispatch: Dispatch;
    isAuthenticated?: boolean;
}

export class LoginPage extends Component<Props> {
    render() {
        const { dispatch, isAuthenticated } = this.props;

        return (
            <div className="App">
                {!isAuthenticated && (
                    <>
                        <KawaiiMessage character={Character.Ghost}>
                            Please enter your credentials to login. If you don't have account yet then you can create
                            one here: <a href="/signup">Sign-up</a>.
                        </KawaiiMessage>

                        <Login
                            onLogin={creds => dispatch(loginRequest(creds))}
                            onLoginFailure={msg => dispatch(messageDisplay('error', msg))}
                        />
                    </>
                )}
                {isAuthenticated && <Redirect to="/" />}
            </div>
        );
    }
}

const mapStateToProps = (state: State) => ({ isAuthenticated: state.auth.isAuthenticated });

export default connect(mapStateToProps)(LoginPage);
