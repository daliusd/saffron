import { combineReducers } from 'redux';

function auth(
    state = {
        isAuthenticated: localStorage.getItem('access_token') ? true : false,
    },
    action
) {
    switch (action.type) {
        case 'LOGIN_REQUEST':
            return Object.assign({}, state, {
                isAuthenticated: false,
                user: action.creds,
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

function quotes(state = {}, action) {
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
