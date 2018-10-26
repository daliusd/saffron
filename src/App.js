// @flow
import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux';
import { fetchQuote, fetchSecretQuote } from './actions';
import Navbar from './components/Navbar';
import Quotes from './components/Quotes';

type Props = {
    dispatch: string => void,
    quote: string,
    isAuthenticated: boolean,
    errorMessage: string,
    isSecretQuote: boolean,
};

class App extends Component<Props> {
    render() {
        const {
            dispatch,
            quote,
            isAuthenticated,
            errorMessage,
            isSecretQuote,
        } = this.props;
        return (
            <div className="App">
                <Navbar
                    isAuthenticated={isAuthenticated}
                    errorMessage={errorMessage}
                    dispatch={dispatch}
                />
                <div className="container">
                    <Quotes
                        onQuoteClick={() => dispatch(fetchQuote())}
                        onSecretQuoteClick={() => dispatch(fetchSecretQuote())}
                        isAuthenticated={isAuthenticated}
                        quote={quote}
                        isSecretQuote={isSecretQuote}
                    />
                </div>
            </div>
        );
    }
}

// These props come from the application's
// state when it is started
function mapStateToProps(state) {
    const { quotes, auth } = state;
    const { quote, authenticated } = quotes;
    const { isAuthenticated, errorMessage } = auth;

    return {
        quote,
        isSecretQuote: authenticated,
        isAuthenticated,
        errorMessage,
    };
}

export default connect(mapStateToProps)(App);
