import {
    all,
    call,
    put,
    select,
    takeEvery,
    takeLatest,
} from 'redux-saga/effects';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

function makeLogin(creds) {
    return axios
        .post('/login', creds)
        .then(resp => {
            return resp.data;
        })
        .catch(error => {
            throw error;
        });
}

function refreshToken(refresh_token) {
    let config = {
        headers: { Authorization: `Bearer ${refresh_token}` },
    };
    return axios
        .post('/token/refresh', {}, config)
        .then(resp => {
            return resp.data.access_token;
        })
        .catch(error => {
            throw error;
        });
}

function saveTokens(data) {
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
}

function saveAccessToken(access_token) {
    localStorage.setItem('access_token', access_token);
}

function cleanTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
}

function getTokenFromStorage() {
    return localStorage.getItem('access_token') || null;
}

function getRefreshTokenFromStorage() {
    return localStorage.getItem('refresh_token') || null;
}

function validateToken(token) {
    const decoded = jwt_decode(token);
    const valid = decoded.exp - new Date().getTime() / 1000 > 5;
    return valid;
}

function* getToken() {
    const token = yield call(getTokenFromStorage);
    const token_valid = yield call(validateToken, token);
    if (token_valid) return token;

    const refresh_token = yield call(getRefreshTokenFromStorage);
    const refresh_token_valid = yield call(validateToken, refresh_token);
    if (!refresh_token_valid) {
        yield put({ type: 'LOGOUT_REQUEST' });
        throw new Error('Re-login required.');
    }

    const new_token = yield call(refreshToken, refresh_token);
    yield call(saveAccessToken, new_token);
    return new_token;
}

function* login(action) {
    try {
        const data = yield call(makeLogin, action.creds);
        yield call(saveTokens, data);
        yield put({ type: 'LOGIN_SUCCESS' });
    } catch (e) {
        yield put({ type: 'LOGIN_FAILURE', message: e.response.data.message });
    }
}

function* loginSaga() {
    yield takeLatest('LOGIN_REQUEST', login);
}

function* logout(action) {
    try {
        //yield call(makeLogout, action.creds);
        yield call(cleanTokens);
        yield put({ type: 'LOGOUT_SUCCESS' });
    } catch (e) {
        yield put({ type: 'LOGOUT_FAILURE', message: e.response.data.message });
    }
}

function* logoutSaga() {
    yield takeLatest('LOGOUT_REQUEST', logout);
}

function getQuote(url, token) {
    let config = {};
    if (token) {
        config = {
            headers: { Authorization: `Bearer ${token}` },
        };
    }

    return axios
        .get(url, config)
        .then(resp => {
            return resp.data;
        })
        .catch(error => {
            throw error;
        });
}

function* quote(action) {
    try {
        let token = action.auth ? yield call(getToken) : null;
        const data = yield call(getQuote, action.url, token);
        yield put({
            type: 'QUOTE_SUCCESS',
            quote: data.message,
            authenticated: action.auth,
        });
    } catch (e) {
        yield put({ type: 'QUOTE_FAILURE', message: e.response.data.message });
    }
}

function* quoteSaga() {
    yield takeLatest('QUOTE_REQUEST', quote);
}

function* loggerSaga() {
    yield takeEvery('*', function* logger(action) {
        const state = yield select();

        console.log('action', action);
        console.log('state after', state);
    });
}

export function* rootSaga() {
    yield all([loginSaga(), logoutSaga(), quoteSaga(), loggerSaga()]);
}
