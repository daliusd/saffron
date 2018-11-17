import { all, call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { refreshToken, getTokens, deleteAccessToken, deleteRefreshToken, getQuote } from './requests';
import { getTokenFromStorage, getRefreshTokenFromStorage, saveAccessToken, saveTokens, cleanTokens } from './storage';
import jwt_decode from 'jwt-decode';

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

export function* logout(action) {
    try {
        const token = yield call(getTokenFromStorage);
        if (token) {
            const token_valid = yield call(validateToken, token);
            if (token_valid) {
                yield call(deleteAccessToken, token);
            }
        }

        const refresh_token = yield call(getRefreshTokenFromStorage);
        if (refresh_token) {
            const refresh_token_valid = yield call(validateToken, refresh_token);
            if (refresh_token_valid) {
                yield call(deleteRefreshToken, refresh_token);
            }
        }

        yield call(cleanTokens);

        yield put({ type: 'LOGOUT_SUCCESS' });
    } catch (e) {
        yield put({ type: 'LOGOUT_FAILURE', message: e.response.data.message });
    }
}

function* logoutSaga() {
    yield takeLatest('LOGOUT_REQUEST', logout);
}

export function* init() {
    let token = yield call(getToken, false);
    if (token) {
        yield put({ type: 'LOGIN_SUCCESS' });
    }
}

function* initSaga() {
    yield takeLatest('INIT_REQUEST', init);
}

function* quote(action) {
    try {
        let token = action.auth ? yield call(getToken, true) : null;
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
    yield all([loginSaga(), logoutSaga(), quoteSaga(), loggerSaga(), initSaga()]);
}
