// @flow
import './App.css';

import { Route, BrowserRouter as Router } from 'react-router-dom';
import { connect } from 'react-redux';
import React, { Component } from 'react';

import { type Dispatch, initRequest } from './actions';
import GamePage from './GamePage';
import LoginPage from './LoginPage';
import Main from './Main';
import Navbar from './components/Navbar';
import SignUpPage from './SignUpPage';

type Props = {
    dispatch: Dispatch,
    isAuthenticated: boolean,
};

export class App extends Component<Props> {
    componentDidMount() {
        this.props.dispatch(initRequest());
    }

    render() {
        const { isAuthenticated } = this.props;
        return (
            <Router>
                <div className="App">
                    <Navbar isAuthenticated={isAuthenticated} />
                    <Route exact path="/" component={Main} />
                    <Route exact path="/login" component={LoginPage} />
                    <Route exact path="/signup" component={SignUpPage} />
                    <Route exact path="/game/:id" component={GamePage} />
                </div>
            </Router>
        );
    }
}

const mapStateToProps = state => {
    const { auth } = state;
    const { isAuthenticated } = auth;

    return {
        isAuthenticated,
    };
};

export default connect(mapStateToProps)(App);
