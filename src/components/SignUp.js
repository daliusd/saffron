// @flow
import { connect } from 'react-redux';
import React, { Component } from 'react';

import { type Dispatch, messageRequest } from '../actions';

type Props = {
    dispatch: Dispatch,
    onSignUp: ({ username: string, password: string }) => void,
};

export class SignUp extends Component<Props> {
    render() {
        return (
            <div>
                <form onSubmit={event => this.handleSubmit(event)}>
                    <input type="text" ref="username" className="form-control" placeholder="Username" />
                    <input type="password" ref="password" className="form-control" placeholder="Password" />
                    <input
                        type="password"
                        ref="password_repeat"
                        className="form-control"
                        placeholder="Repeat password here"
                    />
                    <input type="submit" value="Sign Up" />
                </form>
            </div>
        );
    }

    handleSubmit(event: SyntheticEvent<>) {
        const { dispatch, onSignUp } = this.props;

        const username = this.refs.username.value.trim();
        const password = this.refs.password.value.trim();
        const password_repeat = this.refs.password_repeat.value.trim();

        if (password !== password_repeat) {
            dispatch(messageRequest('error', 'Passwords do not match.'));
        } else {
            const creds = {
                username: username,
                password: password,
            };
            onSignUp(creds);
        }
        event.preventDefault();
    }
}
export default connect()(SignUp);
