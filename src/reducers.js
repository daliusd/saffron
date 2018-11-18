// @flow
import { combineReducers } from 'redux';

type AuthState = {
    +isAuthenticated: boolean,
    +errorMessage: string,
    +user: string,
};

type QuoteState = {
    +quote: string,
    +authenticated: boolean,
    +errorMessage: string,
};

export type LoginAction =
    | { type: 'LOGIN_REQUEST', creds: { username: string, password: string } }
    | { type: 'LOGIN_SUCCESS' }
    | { type: 'LOGIN_FAILURE', message: string }
    | { type: 'LOGOUT_SUCCESS' };

export type QuoteAction =
    | { type: 'QUOTE_REQUEST' }
    | { type: 'QUOTE_SUCCESS', quote: string, authenticated: boolean }
    | { type: 'QUOTE_FAILURE', message: string };

export type Action = LoginAction | QuoteAction;

export function auth(
    state: AuthState = {
        isAuthenticated: false,
        user: '',
        errorMessage: '',
    },
    action: LoginAction,
): AuthState {
    switch (action.type) {
        case 'LOGIN_REQUEST':
            return Object.assign({}, state, {
                isAuthenticated: false,
                user: action.creds.username,
            });
        case 'LOGIN_SUCCESS':
            return Object.assign({}, state, {
                isAuthenticated: true,
                errorMessage: '',
            });
        case 'LOGIN_FAILURE':
            return Object.assign({}, state, {
                isAuthenticated: false,
                errorMessage: action.message,
            });
        case 'LOGOUT_SUCCESS':
            return Object.assign({}, state, {
                isAuthenticated: false,
            });
        default:
            return state;
    }
}

export function quotes(
    state: QuoteState = {
        quote: '',
        authenticated: false,
        errorMessage: '',
    },
    action: QuoteAction,
) {
    switch (action.type) {
        case 'QUOTE_REQUEST':
            return state;
        case 'QUOTE_SUCCESS':
            return Object.assign({}, state, {
                quote: action.quote,
                authenticated: action.authenticated,
            });
        case 'QUOTE_FAILURE':
            return Object.assign({}, state, {
                errorMessage: action.message,
            });
        default:
            return state;
    }
}

const quotesApp = combineReducers({
    auth,
    quotes,
});

export default quotesApp;
