import React, { Component, createRef } from 'react';

interface Props {
    onLogin: (creds: { username: string; password: string }) => void;
}

export default class Login extends Component<Props> {
    usernameRef = createRef<HTMLInputElement>();
    passwordRef = createRef<HTMLInputElement>();

    handleSubmit(event: React.FormEvent) {
        const username = this.usernameRef.current;
        const password = this.passwordRef.current;
        if (username && password) {
            const creds = {
                username: username.value.trim(),
                password: password.value.trim(),
            };
            this.props.onLogin(creds);
        }
        event.preventDefault();
    }

    render() {
        return (
            <div>
                <form onSubmit={event => this.handleSubmit(event)}>
                    <input type="text" ref={this.usernameRef} className="form-control" placeholder="Username" />
                    <input type="password" ref={this.passwordRef} className="form-control" placeholder="Password" />
                    <input type="submit" value="Login" />
                </form>
            </div>
        );
    }
}
