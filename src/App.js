// @flow
import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux';
import { fetchQuote, fetchSecretQuote } from './actions';
import Navbar from './components/Navbar';
import Quotes from './components/Quotes';

type Props = {
    fetchQuote: () => void,
    fetchSecretQuote: () => void,
    quote: string,
    isAuthenticated: boolean,
    errorMessage: string,
    isSecretQuote: boolean,
};

class App extends Component<Props> {
    render() {
        const {
            fetchQuote,
            fetchSecretQuote,
            quote,
            isAuthenticated,
            isSecretQuote,
        } = this.props;
        return (
            <div className="App">
                <Navbar isAuthenticated={isAuthenticated} />
                <div className="container">
                    <Quotes
                        onQuoteClick={() => fetchQuote()}
                        onSecretQuoteClick={() => fetchSecretQuote()}
                        isAuthenticated={isAuthenticated}
                        quote={quote}
                        isSecretQuote={isSecretQuote}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { quotes, auth } = state;
    const { quote, authenticated } = quotes;
    const { isAuthenticated, errorMessage } = auth;

    return {
        quote,
        isSecretQuote: authenticated,
        isAuthenticated,
        errorMessage,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchQuote: () => {
            dispatch(fetchQuote());
        },
        fetchSecretQuote: () => {
            dispatch(fetchSecretQuote());
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
