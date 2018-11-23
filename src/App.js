// @flow
import './App.css';

import { connect } from 'react-redux';
import React, { Component } from 'react';

import { quoteRequest, secretQuoteRequest } from './actions';
import Action from './reducers';
import Navbar from './components/Navbar';
import Quotes from './components/Quotes';

type Props = {
    dispatch: Action => any,
    quote: string,
    isAuthenticated: boolean,
    errorMessage: string,
    isSecretQuote: boolean,
};

class App extends Component<Props> {
    componentDidMount() {
        this.props.dispatch({ type: 'INIT_REQUEST' });
    }

    render() {
        const { dispatch, quote, isAuthenticated, isSecretQuote } = this.props;
        return (
            <div className="App">
                <Navbar isAuthenticated={isAuthenticated} />
                <div className="container">
                    <Quotes
                        onQuoteClick={() => dispatch(quoteRequest())}
                        onSecretQuoteClick={() => dispatch(secretQuoteRequest())}
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

export default connect(mapStateToProps)(App);
