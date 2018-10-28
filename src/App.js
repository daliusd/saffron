// @flow
import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux';
import Navbar from './components/Navbar';
import Quotes from './components/Quotes';
import Action from './reducers';

type Props = {
    dispatch: Action => any,
    quote: string,
    isAuthenticated: boolean,
    errorMessage: string,
    isSecretQuote: boolean,
};

class App extends Component<Props> {
    render() {
        const { dispatch, quote, isAuthenticated, isSecretQuote } = this.props;
        return (
            <div className="App">
                <Navbar isAuthenticated={isAuthenticated} />
                <div className="container">
                    <Quotes
                        onQuoteClick={() =>
                            dispatch({
                                type: 'QUOTE_REQUEST',
                                url: '/fortune',
                                auth: false,
                            })
                        }
                        onSecretQuoteClick={() =>
                            dispatch({
                                type: 'QUOTE_REQUEST',
                                url: '/fortunedebian',
                                auth: true,
                            })
                        }
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
