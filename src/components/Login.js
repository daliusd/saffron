// @flow
import React, { Component } from 'react';

type Props = {
    onLogin: ({ username: string, password: string }) => void,
};

export default class Login extends Component<Props> {
    render() {
        return (
            <div>
                <form onSubmit={event => this.handleSubmit(event)}>
                    <input type="text" ref="username" className="form-control" placeholder="Username" />
                    <input type="password" ref="password" className="form-control" placeholder="Password" />
                    <input type="submit" value="Login" />
                </form>
            </div>
        );
    }

    handleSubmit(event: SyntheticEvent<>) {
        const username = this.refs.username;
        const password = this.refs.password;
        const creds = {
            username: username.value.trim(),
            password: password.value.trim(),
        };
        this.props.onLogin(creds);
        event.preventDefault();
    }
}
