import axios from 'axios';

// There are three possible states for our login
// process and we need actions for each of them
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

function requestLogin(creds) {
    return {
        type: LOGIN_REQUEST,
        isFetching: true,
        isAuthenticated: false,
        creds,
    };
}

function receiveLogin(user) {
    return {
        type: LOGIN_SUCCESS,
        isFetching: false,
        isAuthenticated: true,
    };
}

function loginError(message) {
    return {
        type: LOGIN_FAILURE,
        isFetching: false,
        isAuthenticated: false,
        message,
    };
}

// Calls the API to get a token and
// dispatches actions along the way
export function loginUser(creds) {
    return dispatch => {
        dispatch(requestLogin(creds));

        return axios
            .post('/login', creds)
            .then(resp => {
                localStorage.setItem('access_token', resp.data.access_token);
                localStorage.setItem('refresh_token', resp.data.refresh_token);
                dispatch(receiveLogin(resp.data));
            })
            .catch(error => {
                if (error.response) {
                    dispatch(loginError(error.response.data.message));
                } else if (error.request) {
                    dispatch(loginError(error.request));
                } else {
                    console.log('Error', error.message);
                }
            });
    };
}

// Three possible states for our logout process as well.
// Since we are using JWTs, we just need to remove the token
// from localStorage. These actions are more useful if we
// were calling the API to log the user out
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';

function requestLogout() {
    return {
        type: LOGOUT_REQUEST,
        isFetching: true,
        isAuthenticated: true,
    };
}

function receiveLogout() {
    return {
        type: LOGOUT_SUCCESS,
        isFetching: false,
        isAuthenticated: false,
    };
}

// Logs the user out
export function logoutUser() {
    return dispatch => {
        dispatch(requestLogout());
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        dispatch(receiveLogout());
    };
}

export const QUOTE_REQUEST = 'QUOTE_REQUEST';
export const QUOTE_SUCCESS = 'QUOTE_SUCCESS';
export const QUOTE_FAILURE = 'QUOTE_FAILURE';

function get_request(authenticated, endpoint) {
    let token = localStorage.getItem('access_token') || null;
    let config = {};

    if (authenticated) {
        if (token) {
            config = {
                headers: { Authorization: `Bearer ${token}` },
            };
        } else {
            throw new Error('No token saved!');
        }
    }

    return dispatch => {
        dispatch({
            type: QUOTE_REQUEST,
        });

        return axios
            .get(endpoint, config)
            .then(resp => {
                dispatch({
                    type: QUOTE_SUCCESS,
                    quote: resp.data.message,
                    authenticated: authenticated,
                });
            })
            .catch(error => {
                dispatch({
                    type: QUOTE_FAILURE,
                });
            });
    };
}

export function fetchQuote(authenticated) {
    return get_request(false, '/fortune');
}

export function fetchSecretQuote(authenticated) {
    return get_request(true, '/fortunedebian');
}
