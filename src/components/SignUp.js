// @flow
import React, { Component } from 'react';

type Props = {
    onSignUpClick: ({ username: string, password: string }) => void,
    errorMessage: string,
};

type State = {
    errorMessage: string,
};

export default class SignUp extends Component<Props, State> {
    state = {
        errorMessage: '',
    };

    constructor(props: Props) {
        super(props);
        this.state.errorMessage = props.errorMessage;
    }

    render() {
        return (
            <div>
                <input type="text" ref="username" className="form-control" placeholder="Username" />
                <input type="password" ref="password" className="form-control" placeholder="Password" />
                <input
                    type="password"
                    ref="password_repeat"
                    className="form-control"
                    placeholder="Repeat password here"
                />
                <button onClick={event => this.handleClick(event)} className="btn btn-primary">
                    Sign Up
                </button>

                {this.state.errorMessage && <p>{this.state.errorMessage}</p>}
            </div>
        );
    }

    handleClick(event: SyntheticEvent<>) {
        const username = this.refs.username.value.trim();
        const password = this.refs.password.value.trim();
        const password_repeat = this.refs.password_repeat.value.trim();

        if (password !== password_repeat) {
            this.setState({ errorMessage: 'Passwords do not match.' });
        } else {
            const creds = {
                username: username,
                password: password,
            };
            this.props.onSignUpClick(creds);
        }
    }
}
