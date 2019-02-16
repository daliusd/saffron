import './App.css';

import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import React, { Component } from 'react';

import { Dispatch, initRequest } from './actions';
import { State } from './reducers';
import CardSetPage from './CardSetPage';
import GamePage from './GamePage';
import LoginPage from './LoginPage';
import Main from './Main';
import Navbar from './components/Navbar';
import NotFoundPage from './NotFoundPage';
import SignUpPage from './SignUpPage';

interface Props {
    dispatch: Dispatch;
    isAuthenticated: boolean;
}

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
                    <Switch>
                        <Route exact path="/" component={Main} />
                        <Route exact path="/login" component={LoginPage} />
                        <Route exact path="/signup" component={SignUpPage} />
                        <Route exact path="/game/:id" component={GamePage} />
                        <Route exact path="/cardset/:id" component={CardSetPage} />
                        <Route component={NotFoundPage} />
                    </Switch>
                    <div className="App-footer">Dalius Dobravolskas &copy; {new Date().getFullYear()}</div>
                </div>
            </Router>
        );
    }
}

const mapStateToProps = (state: State) => {
    const { auth } = state;
    const { isAuthenticated } = auth;

    return {
        isAuthenticated,
    };
};

export default connect(mapStateToProps)(App);
