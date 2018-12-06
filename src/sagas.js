import { all, call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';
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
import { gameSelectRequest, messageRequest } from './actions';
import { getTokenFromStorage, getRefreshTokenFromStorage, saveAccessToken, saveTokens, cleanTokens } from './storage';

// Messages
export function* putError(message) {
    yield put(messageRequest('error', message));
}

export function* handleMessageDisplay(action) {
    yield call(delay, 5000);
    yield put({ type: 'MESSAGE_HIDE', message: action.message });
}

function* messageDisplaySaga() {
    yield takeEvery('MESSAGE_DISPLAY', handleMessageDisplay);
}

// Login & Signup
// Token handling

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

// Login

export function* handleLoginRequest(action) {
    try {
        const data = yield call(getTokens, action.creds);
        yield call(saveTokens, data);
        yield put({ type: 'LOGIN_SUCCESS' });
    } catch (e) {
        yield put({ type: 'LOGIN_FAILURE' });
        yield call(putError, e.message);
    }
}

function* loginRequestSaga() {
    yield takeLatest('LOGIN_REQUEST', handleLoginRequest);
}

export function* handleLoginSuccess(action) {
    yield put({ type: 'GAME_LIST_REQUEST' });
}

function* loginSuccessSaga() {
    yield takeLatest('LOGIN_SUCCESS', handleLoginSuccess);
}

// Logout

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

export function* handleLogoutRequest(action) {
    try {
        yield call(logoutToken);
        yield call(logoutRefreshToken);
        yield call(cleanTokens);

        yield put({ type: 'LOGOUT_SUCCESS' });
    } catch (e) {
        yield put({ type: 'LOGOUT_FAILURE' });
        yield call(putError, e.message);
    }
}

function* logoutRequestSaga() {
    yield takeLatest('LOGOUT_REQUEST', handleLogoutRequest);
}

// Sign-up

export function* handleSignupRequest(action) {
    try {
        const data = yield call(registerUser, action.creds);
        yield call(saveTokens, data);
        yield put({ type: 'SIGNUP_SUCCESS' });
        yield put({ type: 'LOGIN_SUCCESS' });
    } catch (e) {
        yield put({ type: 'SIGNUP_FAILURE' });
        yield call(putError, e.message);
    }
}

function* signupSaga() {
    yield takeLatest('SIGNUP_REQUEST', handleSignupRequest);
}

// Init
export function* handleInitRequest() {
    let token = yield call(getToken, false);
    if (token) {
        yield put({ type: 'LOGIN_SUCCESS' });
    }
}

function* initSaga() {
    yield takeLatest('INIT_REQUEST', handleInitRequest);
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
export function* handleGameCreateRequest(action) {
    try {
        yield call(authorizedPostRequest, '/game', { name: action.gamename });
        yield put({
            type: 'GAME_CREATE_SUCCESS',
        });
        yield put({ type: 'GAME_LIST_REQUEST' });
    } catch (e) {
        yield put({ type: 'GAME_CREATE_FAILURE' });
        yield call(putError, e.message);
    }
}

function* gameCreateSaga() {
    yield takeLatest('GAME_CREATE_REQUEST', handleGameCreateRequest);
}

export function* handleGameListRequest() {
    try {
        const data = yield call(authorizedGetRequest, '/game');
        yield put({
            type: 'GAME_LIST_SUCCESS',
            games: data.games,
        });
    } catch (e) {
        yield put({ type: 'GAME_LIST_FAILURE' });
        yield call(putError, e.message);
    }
}

function* gameListSaga() {
    yield takeLatest('GAME_LIST_REQUEST', handleGameListRequest);
}

export function* handleGameSelectRequest(action) {
    try {
        const data = yield call(authorizedGetRequest, '/game/' + action.id);
        yield put({
            type: 'GAME_SELECT_SUCCESS',
        });

        yield put({
            type: 'CARDSET_LIST_SUCCESS',
            cardsets: data.cardsets,
        });
    } catch (e) {
        yield put({ type: 'GAME_SELECT_FAILURE' });
        yield call(putError, e.message);
    }
}

function* gameSelectSaga() {
    yield takeLatest('GAME_SELECT_REQUEST', handleGameSelectRequest);
}

// Card Set

export function* handleCardSetCreateRequest(action) {
    try {
        yield call(authorizedPostRequest, '/cardset', {
            name: action.cardsetname,
            game_id: action.game_id,
            data: '{}',
        });
        yield put({
            type: 'CARDSET_CREATE_SUCCESS',
        });
        yield put(gameSelectRequest(action.game_id));
    } catch (e) {
        yield put({ type: 'CARDSET_CREATE_FAILURE' });
        yield call(putError, e.message);
    }
}

function* cardSetCreateSaga() {
    yield takeLatest('CARDSET_CREATE_REQUEST', handleCardSetCreateRequest);
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
    yield all([
        messageDisplaySaga(),
        loginRequestSaga(),
        loginSuccessSaga(),
        logoutRequestSaga(),
        signupSaga(),
        gameCreateSaga(),
        gameListSaga(),
        gameSelectSaga(),
        cardSetCreateSaga(),
        loggerSaga(),
        initSaga(),
    ]);
}
