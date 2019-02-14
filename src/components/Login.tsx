import React, { Component } from 'react';

interface Props {
    onLogin: (creds: { username: string; password: string }) => void;
    onLoginFailure: (message: string) => void;
}

interface LocalState {
    username: string;
    password: string;
}

export default class Login extends Component<Props, LocalState> {
    state = {
        username: '',
        password: '',
    };

    handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ username: event.target.value });
    };

    handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ password: event.target.value });
    };

    handleSubmit = (event: React.FormEvent) => {
        const username = this.state.username.trim();
        const password = this.state.password.trim();
        if (username && password) {
            const creds = { username, password };
            this.props.onLogin(creds);
        } else {
            this.props.onLoginFailure('Missing username and/or password.');
        }
        event.preventDefault();
    };

    render() {
        return (
            <div>
                <form className="form" onSubmit={this.handleSubmit}>
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
                    <input type="submit" value="Login" />
                </form>
            </div>
        );
    }
}
