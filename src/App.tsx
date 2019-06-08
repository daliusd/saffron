import './App.css';

import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { isIE } from 'react-device-detect';

import { Dispatch, initRequest } from './actions';
import { State } from './reducers';
import AboutPage from './AboutPage';
import CardSetPage from './CardSetPage';
import ChangelogPage from './ChangelogPage';
import ErrorBoundry from './ErrorBoundry';
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
        if (isIE) return <div> IE is not supported. Download Chrome/Opera/Firefox </div>;
        const { isAuthenticated } = this.props;
        return (
            <Router>
                <div className="App">
                    <ErrorBoundry>
                        <Navbar isAuthenticated={isAuthenticated} />
                        <Switch>
                            <Route exact path="/" component={Main} />
                            <Route exact path="/login" component={LoginPage} />
                            <Route exact path="/signup" component={SignUpPage} />
                            <Route exact path="/game/:id" component={GamePage} />
                            <Route exact path="/cardset/:id" component={CardSetPage} />
                            <Route exact path="/changelog" component={ChangelogPage} />
                            <Route exact path="/about" component={AboutPage} />
                            <Route component={NotFoundPage} />
                        </Switch>
                        <div className="App-footer">Dalius Dobravolskas &copy; {new Date().getFullYear()}</div>
                    </ErrorBoundry>
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
