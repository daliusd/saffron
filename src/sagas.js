import { all, call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import jwt_decode from 'jwt-decode';

import {
    deleteAccessToken,
    deleteRefreshToken,
    getRequest,
    getTokens,
    postRequest,
    refreshToken,
    registerUser,
} from './requests';
import { getTokenFromStorage, getRefreshTokenFromStorage, saveAccessToken, saveTokens, cleanTokens } from './storage';

export function validateToken(token) {
    try {
        const decoded = jwt_decode(token);
        const valid = decoded.exp - new Date().getTime() / 1000 > 5;
        return valid;
    } catch (e) {
        return false;
    }
}

export function* getToken(with_error_if_missing) {
    const token = yield call(getTokenFromStorage);
    if (token) {
        const token_valid = yield call(validateToken, token);
        if (token_valid) return token;
    }

    const refresh_token = yield call(getRefreshTokenFromStorage);
    if (!refresh_token) {
        if (with_error_if_missing) throw new Error('Token not found.');
        return null;
    }

    const refresh_token_valid = yield call(validateToken, refresh_token);
    if (!refresh_token_valid) {
        yield put({ type: 'LOGOUT_REQUEST' });
        if (with_error_if_missing) throw new Error('Token not found.');
        return null;
    }

    const new_token = yield call(refreshToken, refresh_token);
    yield call(saveAccessToken, new_token);
    return new_token;
}

export function* login(action) {
    try {
        const data = yield call(getTokens, action.creds);
        yield call(saveTokens, data);
        yield put({ type: 'LOGIN_SUCCESS' });
    } catch (e) {
        yield put({ type: 'LOGIN_FAILURE', message: e.response.data.message });
    }
}

function* loginSaga() {
    yield takeLatest('LOGIN_REQUEST', login);
}

export function* logoutToken() {
    const token = yield call(getTokenFromStorage);
    if (token) {
        const token_valid = yield call(validateToken, token);
        if (token_valid) {
            yield call(deleteAccessToken, token);
        }
    }
}

export function* logoutRefreshToken() {
    const refresh_token = yield call(getRefreshTokenFromStorage);
    if (refresh_token) {
        const refresh_token_valid = yield call(validateToken, refresh_token);
        if (refresh_token_valid) {
            yield call(deleteRefreshToken, refresh_token);
        }
    }
}

export function* logout(action) {
    try {
        yield call(logoutToken);
        yield call(logoutRefreshToken);
        yield call(cleanTokens);

        yield put({ type: 'LOGOUT_SUCCESS' });
    } catch (e) {
        yield put({ type: 'LOGOUT_FAILURE', message: e.response.data.message });
    }
}

function* logoutSaga() {
    yield takeLatest('LOGOUT_REQUEST', logout);
}

// Sign-up

export function* signup(action) {
    try {
        const data = yield call(registerUser, action.creds);
        yield call(saveTokens, data);
        yield put({ type: 'SIGNUP_SUCCESS' });
        yield put({ type: 'LOGIN_SUCCESS' });
    } catch (e) {
        yield put({ type: 'SIGNUP_FAILURE', message: e.response.data.message });
    }
}

function* signupSaga() {
    yield takeLatest('SIGNUP_REQUEST', signup);
}

// Init
export function* init() {
    let token = yield call(getToken, false);
    if (token) {
        yield put({ type: 'LOGIN_SUCCESS' });
        yield put({ type: 'GAME_LIST_REQUEST' });
    }
}

function* initSaga() {
    yield takeLatest('INIT_REQUEST', init);
}

// Authorized Requests
export function* authorizedGetRequest(url) {
    const token = yield call(getToken, true);
    return yield call(getRequest, url, token);
}

export function* authorizedPostRequest(url, data) {
    const token = yield call(getToken, true);
    return yield call(postRequest, url, token, data);
}

// Game
export function* gameCreate(action) {
    try {
        yield call(authorizedPostRequest, '/game', { name: action.gamename, data: '{}' });
        yield put({
            type: 'GAME_CREATE_SUCCESS',
        });
        yield put({ type: 'GAME_LIST_REQUEST' });
    } catch (e) {
        yield put({ type: 'GAME_CREATE_FAILURE', message: e.response.data.message });
    }
}

export function* gameList() {
    try {
        const data = yield call(authorizedGetRequest, '/game');
        yield put({
            type: 'GAME_LIST_SUCCESS',
            gamelist: data.games,
        });
    } catch (e) {
        yield put({ type: 'GAME_LIST_FAILURE', message: e.response.data.message });
    }
}

function* gameCreateSaga() {
    yield takeLatest('GAME_CREATE_REQUEST', gameCreate);
}

function* gameListSaga() {
    yield takeLatest('GAME_LIST_REQUEST', gameList);
}

// Logger
function* loggerSaga() {
    yield takeEvery('*', function* logger(action) {
        const state = yield select();

        console.log('action', action);
        console.log('state after', state);
    });
}

// All
export function* rootSaga() {
    yield all([loginSaga(), logoutSaga(), signupSaga(), gameCreateSaga(), gameListSaga(), loggerSaga(), initSaga()]);
}
