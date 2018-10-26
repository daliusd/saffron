import { combineReducers } from 'redux';
import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT_SUCCESS,
    QUOTE_REQUEST,
    QUOTE_SUCCESS,
    QUOTE_FAILURE,
} from './actions';

// The auth reducer. The starting state sets authentication
// based on a token being in local storage. In a real app,
// we would also want a util to check if the token is expired.
function auth(
    state = {
        isFetching: false,
        isAuthenticated: localStorage.getItem('access_token') ? true : false,
    },
    action
) {
    switch (action.type) {
        case LOGIN_REQUEST:
            return Object.assign({}, state, {
                isFetching: action.isFetching,
                isAuthenticated: false,
                user: action.creds,
            });
        case LOGIN_SUCCESS:
            return Object.assign({}, state, {
                isFetching: action.isFetching,
                isAuthenticated: true,
                errorMessage: '',
            });
        case LOGIN_FAILURE:
            return Object.assign({}, state, {
                isFetching: action.isFetching,
                isAuthenticated: false,
                errorMessage: action.message,
            });
        case LOGOUT_SUCCESS:
            return Object.assign({}, state, {
                isFetching: action.isFetching,
                isAuthenticated: false,
            });
        default:
            return state;
    }
}

// The quotes reducer
function quotes(state = {}, action) {
    switch (action.type) {
        case QUOTE_REQUEST:
            return Object.assign({}, state, {
                isFetching: action.isFetching,
            });
        case QUOTE_SUCCESS:
            return Object.assign({}, state, {
                isFetching: action.isFetching,
                quote: action.quote,
            });
        case QUOTE_FAILURE:
            return Object.assign({}, state, {
                isFetching: false,
            });
        default:
            return state;
    }
}

// We combine the reducers here so that they
// can be left split apart above
const quotesApp = combineReducers({
    auth,
    quotes,
});

export default quotesApp;
