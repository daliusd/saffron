import { connect } from 'react-redux';
import React, { Component } from 'react';

import { Credentials } from '../types';
import { Dispatch, messageDisplay } from '../actions';

interface Props {
    dispatch: Dispatch;
    onSignUp: (cred: Credentials) => void;
}

export class SignUp extends Component<Props> {
    state = {
        username: '',
        password: '',
        passwordRepeat: '',
    };

    handleSubmit(event: React.FormEvent) {
        const { dispatch, onSignUp } = this.props;

        if (this.state.password !== this.state.passwordRepeat) {
            dispatch(messageDisplay('error', 'Passwords do not match.'));
        } else {
            const creds = {
                username: this.state.username.trim(),
                password: this.state.password.trim(),
            };
            onSignUp(creds);
        }

        event.preventDefault();
    }

    handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ username: event.target.value });
    };

    handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ password: event.target.value });
    };

    handlePasswordRepeatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ passwordRepeat: event.target.value });
    };

    render() {
        return (
            <div>
                <form className="form" onSubmit={event => this.handleSubmit(event)}>
                    <input
                        type="text"
                        onChange={this.handleUsernameChange}
                        className="form-control"
                        placeholder="Username"
                    />
                    <input
                        type="password"
                        onChange={this.handlePasswordChange}
                        className="form-control"
                        placeholder="Password"
                    />
                    <input
                        type="password"
                        onChange={this.handlePasswordRepeatChange}
                        className="form-control"
                        placeholder="Repeat password here"
                    />
                    <input type="submit" value="Sign Up" />
                </form>
            </div>
        );
    }
}
export default connect()(SignUp);
