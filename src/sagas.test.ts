import { call, put, select } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import { delay } from 'redux-saga';
import { ActionCreators } from 'redux-undo';

import jwt from 'jwt-simple';

import { CardSetType, GameType } from './types';
import {
    CARDSET_CREATE_FAILURE,
    CARDSET_CREATE_REQUEST,
    CARDSET_CREATE_SUCCESS,
    CARDSET_LIST_RESET,
    CARDSET_LIST_SUCCESS,
    CARDSET_SELECT_FAILURE,
    CARDSET_SELECT_REQUEST,
    CARDSET_SELECT_SUCCESS,
    CardSetCreateRequest,
    CardSetSelectRequest,
    GAME_CREATE_REQUEST,
    GAME_CREATE_SUCCESS,
    GAME_LIST_FAILURE,
    GAME_LIST_REQUEST,
    GAME_LIST_RESET,
    GAME_LIST_SUCCESS,
    GAME_SELECT_FAILURE,
    GAME_SELECT_REQUEST,
    GAME_SELECT_SUCCESS,
    GameCreateRequest,
    GameSelectRequest,
    LOGIN_FAILURE,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGOUT_FAILURE,
    LOGOUT_REQUEST,
    LOGOUT_SUCCESS,
    MESSAGE_HIDE,
    SIGNUP_FAILURE,
    SIGNUP_REQUEST,
    SIGNUP_SUCCESS,
    gameSelectRequest,
    messageDisplay,
    CARDSETS_SELECT_SUCCESS,
    CardSetSelectSuccessDataV3,
} from './actions';
import { CURRENT_CARDSET_VERSION } from './constants';
import { CardSetsState, DefaultCardSetsState, DefaultCardSetState, CardSetState } from './reducers';
import {
    authorizedGetRequest,
    authorizedPostRequest,
    authorizedPutRequest,
    getToken,
    handleCardSetChange,
    handleCardSetCreateRequest,
    handleCardSetSelectRequest,
    handleGameCreateRequest,
    handleGameListRequest,
    handleGameSelectRequest,
    handleInitRequest,
    handleLoginRequest,
    handleLoginSuccess,
    handleLogoutRequest,
    handleMessageDisplay,
    handleSignupRequest,
    hideProgress,
    logoutRefreshToken,
    logoutToken,
    putError,
    putInfo,
    putProgress,
    validateToken,
    processData,
} from './sagas';
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
import { loadFontsUsedInPlaceholders } from './fontLoader';
import { saveTokens, saveAccessToken, getTokenFromStorage, getRefreshTokenFromStorage, cleanTokens } from './storage';

test('putError', () => {
    putError(new Error('random error')).next();
});

test('handleMessageDisplay', () => {
    const message = messageDisplay('error', 'message');
    let gen = handleMessageDisplay(message);
    expect(gen.next().value).toEqual(call(delay, 5000));
    expect(gen.next().value).toEqual(put({ type: MESSAGE_HIDE, messageId: message.message.id }));
    expect(gen.next().done).toBeTruthy();
});

test('validateToken', () => {
    expect(validateToken('random_string')).toBeFalsy();

    let payload = { exp: Date.now() / 1000 };
    let secret = 'paslaptis';
    let token = jwt.encode(payload, secret);

    expect(validateToken(token)).toBeFalsy();

    payload = { exp: Date.now() / 1000 + 10 };
    token = jwt.encode(payload, secret);

    expect(validateToken(token)).toBeTruthy();
});

test('handleLoginRequest', () => {
    const creds = { username: 'username', password: 'password' };
    const gen = cloneableGenerator(handleLoginRequest)({ type: LOGIN_REQUEST, creds });

    // Success case
    const clone = gen.clone();

    expect(clone.next().value).toEqual(call(getTokens, creds));
    const data = { accessToken: 'test', refreshToken: 'testref' };
    expect(clone.next(data).value).toEqual(call(saveTokens, data));
    expect(clone.next().value).toEqual(put({ type: LOGIN_SUCCESS }));
    expect(clone.next().done).toBeTruthy();

    // Failure case
    const clone2 = gen.clone();
    expect(clone2.next().value).toEqual(call(getTokens, creds));
    let error = new Error('oops');
    expect(clone2.throw && clone2.throw(error).value).toEqual(put({ type: LOGIN_FAILURE }));
    expect(clone2.next().value).toEqual(call(putError, error));
    expect(clone2.next().done).toBeTruthy();
});

test('handleLoginSuccess', () => {
    const gen = handleLoginSuccess();
    expect(gen.next().value).toEqual(put({ type: GAME_LIST_REQUEST }));
    expect(gen.next().done).toBeTruthy();
});

test('getToken with_error_if_missing=false', () => {
    const gen = cloneableGenerator(getToken)(false, false);

    expect(gen.next().value).toEqual(call(getTokenFromStorage));

    // Token in storage cases
    let clone = gen.clone();

    const token = 'token';
    expect(clone.next(token).value).toEqual(call(validateToken, token));

    const invalidToken = clone.clone();
    let next = clone.next(true);
    expect(next.done).toBeTruthy();
    expect(next.value).toEqual(token);

    // Token in storage invalid. Continue with the flow.
    expect(invalidToken.next(false).done).toBeFalsy();

    // Token not in storage, Refresh token in storage
    expect(gen.next(null).value).toEqual(call(getRefreshTokenFromStorage));

    clone = gen.clone();
    next = clone.next(null);
    expect(next.done).toBeTruthy();
    expect(next.value).toBeNull();

    const refreshTokenValue = 'refreshTokenValue';
    expect(gen.next(refreshTokenValue).value).toEqual(call(validateToken, refreshTokenValue));

    clone = gen.clone();
    expect(clone.next(false).value).toEqual(put({ type: LOGOUT_REQUEST }));
    next = clone.next(null);
    expect(next.done).toBeTruthy();
    expect(next.value).toBeNull();

    expect(gen.next(true).value).toEqual(call(refreshToken, refreshTokenValue));
    expect(gen.next('new_token').value).toEqual(call(saveAccessToken, 'new_token'));
    next = gen.next();
    expect(next.done).toBeTruthy();
    expect(next.value).toEqual('new_token');
});

test('getToken with_error_if_missing=true', () => {
    const gen = cloneableGenerator(getToken)(true, false);

    expect(gen.next().value).toEqual(call(getTokenFromStorage));

    // Token in storage cases
    let clone = gen.clone();

    const token = 'token';
    expect(clone.next(token).value).toEqual(call(validateToken, token));

    const invalidToken = clone.clone();
    let next = clone.next(true);
    expect(next.done).toBeTruthy();
    expect(next.value).toEqual(token);

    // Token in storage invalid. Continue with the flow.
    expect(invalidToken.next(false).done).toBeFalsy();

    // Token not in storage, Refresh token in storage
    expect(gen.next(null).value).toEqual(call(getRefreshTokenFromStorage));

    clone = gen.clone();
    expect(() => {
        clone.next(null);
    }).toThrow();

    const refreshTokenValue = 'refreshTokenValue';
    expect(gen.next(refreshTokenValue).value).toEqual(call(validateToken, refreshTokenValue));

    clone = gen.clone();
    expect(clone.next(false).value).toEqual(put({ type: LOGOUT_REQUEST }));
    expect(() => {
        clone.next(null);
    }).toThrow();

    expect(gen.next(true).value).toEqual(call(refreshToken, refreshTokenValue));
    expect(gen.next('new_token').value).toEqual(call(saveAccessToken, 'new_token'));
    next = gen.next();
    expect(next.done).toBeTruthy();
    expect(next.value).toEqual('new_token');
});

test('handleLogoutRequest', () => {
    const gen = cloneableGenerator(handleLogoutRequest)();

    expect(gen.next().value).toEqual(call(logoutToken));
    expect(gen.next().value).toEqual(call(logoutRefreshToken));
    expect(gen.next().value).toEqual(call(cleanTokens));
    expect(gen.next().value).toEqual(put({ type: CARDSET_LIST_RESET }));
    expect(gen.next().value).toEqual(put({ type: GAME_LIST_RESET }));
    expect(gen.next().value).toEqual(put({ type: LOGOUT_SUCCESS }));
    expect(gen.next().done).toBeTruthy();
});

test('handleLogoutRequest failure', () => {
    const gen = cloneableGenerator(handleLogoutRequest)();

    expect(gen.next().value).toEqual(call(logoutToken));

    let error = new Error('oops');
    expect(gen.throw && gen.throw(error).value).toEqual(put({ type: LOGOUT_FAILURE }));
    expect(gen.next().value).toEqual(call(putError, error));
    expect(gen.next().done).toBeTruthy();
});

test('logoutToken', () => {
    const gen = cloneableGenerator(logoutToken)();

    expect(gen.next().value).toEqual(call(getTokenFromStorage));

    let clone = gen.clone();
    expect(clone.next(null).done).toBeTruthy();

    const token = 'token';
    expect(gen.next(token).value).toEqual(call(validateToken, token));

    clone = gen.clone();
    expect(clone.next(null).done).toBeTruthy();

    expect(gen.next(true).value).toEqual(call(deleteAccessToken, token));
    expect(gen.next(null).done).toBeTruthy();
});

test('logoutRefreshToken', () => {
    const gen = cloneableGenerator(logoutRefreshToken)();

    expect(gen.next().value).toEqual(call(getRefreshTokenFromStorage));

    let clone = gen.clone();
    expect(clone.next(null).done).toBeTruthy();

    const token = 'token';
    expect(gen.next(token).value).toEqual(call(validateToken, token));

    clone = gen.clone();
    expect(clone.next(null).done).toBeTruthy();

    expect(gen.next(true).value).toEqual(call(deleteRefreshToken, token));
    expect(gen.next(null).done).toBeTruthy();
});

// Signup
test('handleSignupRequest', () => {
    const creds = { username: 'username', password: 'password' };
    const gen = cloneableGenerator(handleSignupRequest)({ type: SIGNUP_REQUEST, creds });

    expect(gen.next().value).toEqual(call(registerUser, creds));

    // Success case
    const clone = gen.clone();

    const data = { accessToken: 'test', refreshToken: 'testref' };
    expect(clone.next(data).value).toEqual(call(saveTokens, data));
    expect(clone.next().value).toEqual(put({ type: SIGNUP_SUCCESS }));
    expect(clone.next().value).toEqual(put({ type: LOGIN_SUCCESS }));
    expect(clone.next().done).toBeTruthy();

    // Failure case
    let error = new Error('oops');
    expect(gen.throw && gen.throw(error).value).toEqual(put({ type: SIGNUP_FAILURE }));
    expect(gen.next().value).toEqual(call(putError, error));
    expect(gen.next().done).toBeTruthy();
});

// Init
test('handleInitRequest', () => {
    const gen = cloneableGenerator(handleInitRequest)();

    expect(gen.next().value).toEqual(call(getToken, false));

    let clone = gen.clone();

    const token = 'token';
    expect(gen.next(token).value).toEqual(put({ type: LOGIN_SUCCESS }));

    expect(gen.next().done).toBeTruthy();

    expect(clone.next(null).done).toBeTruthy();
});

// Authorized Requests
test('authorizedGetRequest', () => {
    const url = '/test';
    const token = 'token';

    const gen = authorizedGetRequest(url);

    expect(gen.next().value).toEqual(call(getToken, true));
    expect(gen.next(token).value).toEqual(call(getRequest, url, token));
    expect(gen.next().done).toBeTruthy();
});

test('authorizedPostRequest', () => {
    const url = '/test';
    const data = { data: 'data' };
    const token = 'token';

    const gen = authorizedPostRequest(url, data);

    expect(gen.next().value).toEqual(call(getToken, true));
    expect(gen.next(token).value).toEqual(call(postRequest, url, token, data));
    expect(gen.next().done).toBeTruthy();
});

test('authorizedPutRequest', () => {
    const url = '/test';
    const data = { data: 'data' };
    const token = 'token';

    const gen = authorizedPutRequest(url, data);

    expect(gen.next().value).toEqual(call(getToken, true));
    expect(gen.next(token).value).toEqual(call(putRequest, url, token, data));
    expect(gen.next().done).toBeTruthy();
});

// Game

test('handleGameCreateRequest', () => {
    const action: GameCreateRequest = { type: GAME_CREATE_REQUEST, gamename: 'test' };
    const gen = cloneableGenerator(handleGameCreateRequest)(action);

    expect(gen.next().value).toEqual(call(authorizedPostRequest, '/api/games', { name: 'test' }));

    let clone = gen.clone();

    // Successful request
    expect(gen.next().value).toEqual(put({ type: GAME_CREATE_SUCCESS }));
    expect(gen.next().value).toEqual(put({ type: GAME_LIST_REQUEST }));
    expect(gen.next().done).toBeTruthy();

    // Failed request
    let error = new Error('message');
    expect(clone.throw && clone.throw(error).value).toEqual(call(putError, error));
    expect(clone.next().done).toBeTruthy();
});

test('handleGameListRequest', () => {
    const gen = cloneableGenerator(handleGameListRequest)();

    expect(gen.next().value).toEqual(call(authorizedGetRequest, '/api/games'));

    let clone = gen.clone();

    // Successful request
    const resp: { data: { games: GameType[] } } = {
        data: { games: [{ id: '2', name: 'test' }, { id: '1', name: 'test2' }] },
    };
    expect(gen.next(resp).value).toEqual(
        put({
            type: GAME_LIST_SUCCESS,
            allIds: ['2', '1'],
            byId: {
                '1': { id: '1', name: 'test2' },
                '2': { id: '2', name: 'test' },
            },
        }),
    );
    expect(gen.next().done).toBeTruthy();

    // Failed request
    let error = new Error('message');
    expect(clone.throw && clone.throw(error).value).toEqual(put({ type: GAME_LIST_FAILURE }));
    expect(clone.next().value).toEqual(call(putError, error));
    expect(clone.next().done).toBeTruthy();
});

test('handleGameSelectRequest', () => {
    const action: GameSelectRequest = { type: GAME_SELECT_REQUEST, id: '123', updateCardSets: true };
    const gen = cloneableGenerator(handleGameSelectRequest)(action);

    expect(gen.next().value).toEqual(call(authorizedGetRequest, '/api/games/123'));

    let clone = gen.clone();

    // Successful request
    const resp: { data: { cardsets: CardSetType[] } } = {
        data: { cardsets: [{ id: '2', name: 'test' }, { id: '1', name: 'test2' }] },
    };

    expect(gen.next(resp).value).toEqual(put({ type: GAME_SELECT_SUCCESS, id: '123' }));
    expect(gen.next().value).toEqual(
        put({
            type: CARDSET_LIST_SUCCESS,
            allIds: ['2', '1'],
            byId: {
                '1': { id: '1', name: 'test2' },
                '2': { id: '2', name: 'test' },
            },
        }),
    );
    expect(gen.next().done).toBeTruthy();

    // Failed request
    let error = new Error('error');
    expect(clone.throw && clone.throw(error).value).toEqual(put({ type: GAME_SELECT_FAILURE }));
    expect(clone.next().value).toEqual(call(putError, error));
    expect(clone.next().done).toBeTruthy();
});

test('handleGameSelectRequest with updateCardSets set to false', () => {
    const action: GameSelectRequest = { type: GAME_SELECT_REQUEST, id: '123', updateCardSets: false };
    const gen = handleGameSelectRequest(action);

    expect(gen.next().value).toEqual(call(authorizedGetRequest, '/api/games/123'));
    expect(gen.next({}).value).toEqual(put({ type: GAME_SELECT_SUCCESS, id: '123' }));
    expect(gen.next().done).toBeTruthy();
});

test('handleCardSetCreateRequest', () => {
    const action: CardSetCreateRequest = {
        type: CARDSET_CREATE_REQUEST,
        cardsetname: 'test',
        width: 30,
        height: 40,
        gameId: '666',
    };
    const gen = cloneableGenerator(handleCardSetCreateRequest)(action);

    expect(gen.next().value).toEqual(
        call(authorizedPostRequest, '/api/cardsets', {
            name: 'test',
            gameId: '666',
            data: JSON.stringify({ width: 30, height: 40, version: CURRENT_CARDSET_VERSION }),
        }),
    );

    let clone = gen.clone();

    // Successful request
    expect(gen.next().value).toEqual(put({ type: CARDSET_CREATE_SUCCESS }));
    expect(gen.next().value).toEqual(put(gameSelectRequest('666', true)));
    expect(gen.next().done).toBeTruthy();

    // Failed request
    let error = new Error('error');
    expect(clone.throw && clone.throw(error).value).toEqual(put({ type: CARDSET_CREATE_FAILURE }));
    expect(clone.next().value).toEqual(call(putError, error));
    expect(clone.next().done).toBeTruthy();
});

test('handleCardSetSelectRequest', () => {
    const action: CardSetSelectRequest = { type: CARDSET_SELECT_REQUEST, id: '345' };
    const gen = cloneableGenerator(handleCardSetSelectRequest)(action);

    expect(gen.next().value).toEqual(call(authorizedGetRequest, '/api/cardsets/345'));

    let clone = gen.clone();

    let data: CardSetSelectSuccessDataV3 = {
        version: CURRENT_CARDSET_VERSION,
        width: 10,
        height: 20,
        isTwoSided: false,
        snappingDistance: 1,
        cardsAllIds: [],
        cardsById: {},
        fields: {},
        fieldsAllIds: [],
        zoom: 1,
    };

    // Successful request
    expect(gen.next({ data: { id: '345', name: 'test', data: JSON.stringify(data), gameId: '666' } }).value).toEqual(
        call(processData, data),
    );

    expect(gen.next(data).value).toEqual(call(loadFontsUsedInPlaceholders, data));

    expect(gen.next().value).toEqual(
        put({
            type: CARDSETS_SELECT_SUCCESS,
            id: '345',
            name: 'test',
        }),
    );

    expect(gen.next().value).toEqual(
        put({
            type: CARDSET_SELECT_SUCCESS,
            data,
        }),
    );
    expect(gen.next().value).toEqual(put(gameSelectRequest('666', false)));
    expect(gen.next().value).toEqual(put(ActionCreators.clearHistory()));
    expect(gen.next().done).toBeTruthy();

    // Failed request
    let error = new Error('error');
    expect(clone.throw && clone.throw(error).value).toEqual(put({ type: CARDSET_SELECT_FAILURE }));
    expect(clone.next().value).toEqual(call(putError, error));
    expect(clone.next().done).toBeTruthy();
});

test('handleCardSetChange', () => {
    const progressId = '123456';

    const gen = cloneableGenerator(handleCardSetChange)();

    expect(gen.next().value).toEqual(call(putProgress, 'Saving Card Set'));
    expect(gen.next(progressId).value).toEqual(call(delay, 1000));

    const state: { cardset: { present: CardSetState }; cardsets: CardSetsState } = {
        cardset: {
            present: {
                ...DefaultCardSetState,
            },
        },
        cardsets: {
            ...DefaultCardSetsState,
            byId: { '123': { id: '123', name: 'name' } },
            active: '123',
        },
    };

    expect(gen.next().value).toEqual(select());
    expect(gen.next(state).value).toEqual(
        call(authorizedPutRequest, '/api/cardsets/123', {
            data: JSON.stringify({
                width: 63.5,
                height: 88.9,
                isTwoSided: false,
                snappingDistance: 1,
                version: CURRENT_CARDSET_VERSION,
                cardsAllIds: [],
                cardsById: {},
                fieldsAllIds: [],
                fields: {},
                zoom: 1,
            }),
            name: 'name',
        }),
    );

    let clone = gen.clone();

    // Successful request
    expect(gen.next().value).toEqual(call(hideProgress, progressId));
    expect(gen.next().value).toEqual(call(putInfo, 'Card Set saved'));
    expect(gen.next().done).toBeTruthy();

    // Failed request
    let error = new Error('error');
    expect(clone.throw && clone.throw(error).value).toEqual(call(hideProgress, progressId));
    expect(clone.next().value).toEqual(call(putError, error));
    expect(clone.next().done).toBeTruthy();
});
