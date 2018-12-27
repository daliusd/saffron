// @flow
import { type Saga, delay } from 'redux-saga';
import { all, call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import jwt_decode from 'jwt-decode';

import {
    type Action,
    type CardSetCreateRequest,
    type CardSetSelectAction,
    type CardSetSelectRequest,
    type GameCreateRequest,
    type GameListSuccess,
    type GameSelectRequest,
    type LoginAction,
    type LoginRequest,
    type MessageAction,
    type SignUpRequest,
    gameSelectRequest,
    messageRequest,
} from './actions';
import {
    deleteAccessToken,
    deleteRefreshToken,
    getRequest,
    getTokens,
    postRequest,
    putRequest,
    refreshToken,
    registerUser,
} from './requests';
import { getTokenFromStorage, getRefreshTokenFromStorage, saveAccessToken, saveTokens, cleanTokens } from './storage';

// Messages
export function* putError(message: string): Saga<void> {
    yield put(messageRequest('error', message));
}

export function* handleMessageDisplay(action: MessageAction): Saga<void> {
    yield call(delay, 5000);
    yield put({ type: 'MESSAGE_HIDE', message: action.message });
}

// Login & Signup
// Token handling

export function validateToken(token: string): boolean {
    try {
        const decoded = jwt_decode(token);
        const valid = decoded.exp - new Date().getTime() / 1000 > 5;
        return valid;
    } catch (e) {
        return false;
    }
}

export function* getToken(with_error_if_missing: boolean): Saga<?string> {
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

export function* handleLoginRequest(action: LoginRequest): Saga<void> {
    try {
        const data = yield call(getTokens, action.creds);
        yield call(saveTokens, data);
        yield put({ type: 'LOGIN_SUCCESS' });
    } catch (e) {
        yield put({ type: 'LOGIN_FAILURE' });
        yield call(putError, e.message);
    }
}

export function* handleLoginSuccess(): Saga<void> {
    yield put({ type: 'GAME_LIST_REQUEST' });
}

// Logout

export function* logoutToken(): Saga<void> {
    const token = yield call(getTokenFromStorage);
    if (token) {
        const token_valid = yield call(validateToken, token);
        if (token_valid) {
            yield call(deleteAccessToken, token);
        }
    }
}

export function* logoutRefreshToken(): Saga<void> {
    const refresh_token = yield call(getRefreshTokenFromStorage);
    if (refresh_token) {
        const refresh_token_valid = yield call(validateToken, refresh_token);
        if (refresh_token_valid) {
            yield call(deleteRefreshToken, refresh_token);
        }
    }
}

export function* handleLogoutRequest(action: LoginAction): Saga<void> {
    try {
        yield call(logoutToken);
        yield call(logoutRefreshToken);
        yield call(cleanTokens);

        yield put({ type: 'CARDSET_LIST_RESET' });
        yield put({ type: 'GAME_LIST_RESET' });
        yield put({ type: 'LOGOUT_SUCCESS' });
    } catch (e) {
        yield put({ type: 'LOGOUT_FAILURE' });
        yield call(putError, e.message);
    }
}

// Sign-up

export function* handleSignupRequest(action: SignUpRequest): Saga<void> {
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

// Init
export function* handleInitRequest(): Saga<void> {
    let token = yield call(getToken, false);
    if (token) {
        yield put({ type: 'LOGIN_SUCCESS' });
    }
}

// Authorized Requests
export function* authorizedGetRequest(url: string): Saga<Object> {
    const token = yield call(getToken, true);
    return yield call(getRequest, url, token);
}

export function* authorizedPostRequest(url: string, data: Object): Saga<Object> {
    const token = yield call(getToken, true);
    return yield call(postRequest, url, token, data);
}

export function* authorizedPutRequest(url: string, data: Object): Saga<Object> {
    const token = yield call(getToken, true);
    return yield call(putRequest, url, token, data);
}

// Game
export function* handleGameCreateRequest(action: GameCreateRequest): Saga<void> {
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

export function* handleGameListRequest(): Saga<void> {
    try {
        const data = yield call(authorizedGetRequest, '/game');
        const allIds = data.games.map(g => g.id);
        const byId = data.games.reduce((obj, g) => {
            obj[g.id] = g;
            return obj;
        }, {});
        yield put(
            ({
                type: 'GAME_LIST_SUCCESS',
                allIds,
                byId,
            }: GameListSuccess),
        );
    } catch (e) {
        yield put({ type: 'GAME_LIST_FAILURE' });
        yield call(putError, e.message);
    }
}

export function* handleGameSelectRequest(action: GameSelectRequest): Saga<void> {
    try {
        const data = yield call(authorizedGetRequest, '/game/' + action.id);
        yield put({
            type: 'GAME_SELECT_SUCCESS',
            id: action.id,
        });

        if (action.updateCardSets) {
            const allIds = data.cardsets.map(g => g.id);
            const byId = data.cardsets.reduce((obj, g) => {
                obj[g.id] = g;
                return obj;
            }, {});
            yield put({
                type: 'CARDSET_LIST_SUCCESS',
                allIds,
                byId,
            });
        }
    } catch (e) {
        yield put({ type: 'GAME_SELECT_FAILURE' });
        yield call(putError, e.message);
    }
}

// Card Set

export function* handleCardSetCreateRequest(action: CardSetCreateRequest): Saga<void> {
    try {
        yield call(authorizedPostRequest, '/cardset', {
            name: action.cardsetname,
            game_id: action.game_id,
            data: '{}',
        });
        yield put({
            type: 'CARDSET_CREATE_SUCCESS',
        });
        yield put(gameSelectRequest(action.game_id, true));
    } catch (e) {
        yield put({ type: 'CARDSET_CREATE_FAILURE' });
        yield call(putError, e.message);
    }
}

export function* handleCardSetSelectRequest(action: CardSetSelectRequest): Saga<void> {
    try {
        const data = yield call(authorizedGetRequest, '/cardset/' + action.id);
        yield put({
            type: 'CARDSET_SELECT_SUCCESS',
            id: data.id,
            name: data.name,
            data: JSON.parse(data.data),
        });
        yield put(gameSelectRequest(data.game_id, false));
    } catch (e) {
        yield put({ type: 'CARDSET_SELECT_FAILURE' });
        yield call(putError, e.message);
    }
}

export function* handleCardSetChange(action: CardSetSelectAction): Saga<void> {
    try {
        yield call(delay, 1000);
        const state = yield select();

        const cardsetId = state.cardsets.active;
        const data = {
            cardsAllIds: state.cardsets.cardsAllIds,
            cardsById: state.cardsets.cardsById,
            template: state.cardsets.template,
            texts: state.cardsets.texts,
        };

        yield call(authorizedPutRequest, '/cardset/' + cardsetId, {
            name: state.cardsets.byId[cardsetId].name,
            data: JSON.stringify(data),
        });
        yield put({
            type: 'CARDSET_UPDATE_DATA_SUCCESS',
        });
    } catch (e) {
        yield put({ type: 'CARDSET_UPDATE_DATA_FAILURE' });
        yield call(putError, e.message);
    }
}

// Logger
function* handleEverything(action: Action) {
    const state = yield select();

    console.log('action', action);
    console.log('state after', state);
}

// All
export function* rootSaga(): Saga<void> {
    yield all([
        takeEvery('MESSAGE_DISPLAY', handleMessageDisplay),
        takeLatest('LOGIN_REQUEST', handleLoginRequest),
        takeLatest('LOGIN_SUCCESS', handleLoginSuccess),
        takeLatest('LOGOUT_REQUEST', handleLogoutRequest),
        takeLatest('SIGNUP_REQUEST', handleSignupRequest),
        takeLatest('GAME_CREATE_REQUEST', handleGameCreateRequest),
        takeLatest('GAME_LIST_REQUEST', handleGameListRequest),
        takeLatest('GAME_SELECT_REQUEST', handleGameSelectRequest),
        takeLatest('CARDSET_CREATE_REQUEST', handleCardSetCreateRequest),
        takeLatest('CARDSET_SELECT_REQUEST', handleCardSetSelectRequest),

        takeLatest('CARDSET_CREATE_CARD', handleCardSetChange),
        takeLatest('CARDSET_CLONE_CARD', handleCardSetChange),
        takeLatest('CARDSET_REMOVE_CARD', handleCardSetChange),
        takeLatest('CARDSET_UPDATE_CARD_COUNT', handleCardSetChange),
        takeLatest('CARDSET_ADD_TEXT_PLACEHOLDER', handleCardSetChange),
        takeLatest('CARDSET_CHANGE_TEXT_PLACEHOLDER_POSITION', handleCardSetChange),
        takeLatest('CARDSET_CHANGE_TEXT_PLACEHOLDER_SIZE', handleCardSetChange),
        takeLatest('CARDSET_CHANGE_TEXT_PLACEHOLDER_ANGLE', handleCardSetChange),
        takeLatest('CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_ALIGN', handleCardSetChange),
        takeLatest('CARDSET_CHANGE_TEXT', handleCardSetChange),

        takeLatest('INIT_REQUEST', handleInitRequest),
        takeEvery('*', handleEverything),
    ]);
}
