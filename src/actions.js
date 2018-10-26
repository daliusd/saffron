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
        id_token: user.id_token,
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
    let config = {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `username=${creds.username}&password=${creds.password}`,
    };

    return dispatch => {
        // We dispatch requestLogin to kickoff the call to the API
        dispatch(requestLogin(creds));

        return fetch('/login', config)
            .then(response =>
                response.json().then(user => ({ user, response }))
            )
            .then(({ user, response }) => {
                if (!response.ok) {
                    // If there was a problem, we want to
                    // dispatch the error condition
                    dispatch(loginError(user.message));
                    return Promise.reject(user);
                } else {
                    // If login was successful, set the token in local storage
                    localStorage.setItem('access_token', user.access_token);
                    localStorage.setItem('refresh_token', user.refresh_token);
                    // Dispatch the success action
                    dispatch(receiveLogin(user));
                }
            })
            .catch(err => console.log('Error: ', err));
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

        return fetch(endpoint, config)
            .then(response =>
                response.json().then(resp => ({ resp, response }))
            )
            .then(({ resp, response }) => {
                if (!response.ok) {
                    dispatch({
                        type: QUOTE_FAILURE,
                    });
                    return Promise.reject(resp);
                } else {
                    dispatch({
                        type: QUOTE_SUCCESS,
                        quote: resp.message,
                        authenticated: authenticated,
                    });
                }
            })
            .catch(err => console.log('Error: ', err));
    };
}

export function fetchQuote(authenticated) {
    return get_request(false, '/fortune');
}

export function fetchSecretQuote(authenticated) {
    return get_request(true, '/fortunedebian');
}
