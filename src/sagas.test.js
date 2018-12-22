// @flow
import { call, put, select } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import { delay } from 'redux-saga';
import shortid from 'shortid';

import jwt from 'jwt-simple';

import {
    type CardSetSelectAction,
    type CardSetType,
    type CardType,
    type GameType,
    gameSelectRequest,
    messageRequest,
} from './actions';
import type { CardSetState } from './reducers';
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
    logoutRefreshToken,
    logoutToken,
    putError,
    validateToken,
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
import { saveTokens, saveAccessToken, getTokenFromStorage, getRefreshTokenFromStorage, cleanTokens } from './storage';

test('putError', () => {
    putError('random error').next();
});

test('handleMessageDisplay', () => {
    const message = messageRequest('error', 'message');
    let gen = handleMessageDisplay(message);
    expect(gen.next().value).toEqual(call(delay, 5000));
    expect(gen.next().value).toEqual(put({ type: 'MESSAGE_HIDE', message: message.message }));
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
    const gen = cloneableGenerator(handleLoginRequest)({ creds });

    // Success case
    const clone = gen.clone();

    expect(clone.next().value).toEqual(call(getTokens, creds));
    const data = { access_token: 'test' };
    expect(clone.next(data).value).toEqual(call(saveTokens, data));
    expect(clone.next().value).toEqual(put({ type: 'LOGIN_SUCCESS' }));
    expect(clone.next().done).toBeTruthy();

    // Failure case
    const clone2 = gen.clone();
    expect(clone2.next().value).toEqual(call(getTokens, creds));
    let message = 'oops';
    expect(clone2.throw({ message }).value).toEqual(put({ type: 'LOGIN_FAILURE' }));
    expect(clone2.next().value).toEqual(call(putError, message));
    expect(clone2.next().done).toBeTruthy();
});

test('handleLoginSuccess', () => {
    const gen = handleLoginSuccess();
    expect(gen.next().value).toEqual(put({ type: 'GAME_LIST_REQUEST' }));
    expect(gen.next().done).toBeTruthy();
});

test('getToken with_error_if_missing=false', () => {
    const gen = cloneableGenerator(getToken)(false);

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

    const refresh_token = 'refresh_token';
    expect(gen.next(refresh_token).value).toEqual(call(validateToken, refresh_token));

    clone = gen.clone();
    expect(clone.next(false).value).toEqual(put({ type: 'LOGOUT_REQUEST' }));
    next = clone.next(null);
    expect(next.done).toBeTruthy();
    expect(next.value).toBeNull();

    expect(gen.next(true).value).toEqual(call(refreshToken, refresh_token));
    expect(gen.next('new_token').value).toEqual(call(saveAccessToken, 'new_token'));
    next = gen.next();
    expect(next.done).toBeTruthy();
    expect(next.value).toEqual('new_token');
});

test('getToken with_error_if_missing=true', () => {
    const gen = cloneableGenerator(getToken)(true);

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

    const refresh_token = 'refresh_token';
    expect(gen.next(refresh_token).value).toEqual(call(validateToken, refresh_token));

    clone = gen.clone();
    expect(clone.next(false).value).toEqual(put({ type: 'LOGOUT_REQUEST' }));
    expect(() => {
        clone.next(null);
    }).toThrow();

    expect(gen.next(true).value).toEqual(call(refreshToken, refresh_token));
    expect(gen.next('new_token').value).toEqual(call(saveAccessToken, 'new_token'));
    next = gen.next();
    expect(next.done).toBeTruthy();
    expect(next.value).toEqual('new_token');
});

test('handleLogoutRequest', () => {
    const gen = cloneableGenerator(handleLogoutRequest)(true);

    expect(gen.next().value).toEqual(call(logoutToken));
    expect(gen.next().value).toEqual(call(logoutRefreshToken));
    expect(gen.next().value).toEqual(call(cleanTokens));
    expect(gen.next().value).toEqual(put({ type: 'CARDSET_LIST_RESET' }));
    expect(gen.next().value).toEqual(put({ type: 'GAME_LIST_RESET' }));
    expect(gen.next().value).toEqual(put({ type: 'LOGOUT_SUCCESS' }));
    expect(gen.next().done).toBeTruthy();
});

test('handleLogoutRequest failure', () => {
    const gen = cloneableGenerator(handleLogoutRequest)(true);

    expect(gen.next().value).toEqual(call(logoutToken));

    let message = 'oops';
    expect(gen.throw({ message }).value).toEqual(put({ type: 'LOGOUT_FAILURE' }));
    expect(gen.next().value).toEqual(call(putError, message));
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
    const gen = cloneableGenerator(handleSignupRequest)({ creds });

    expect(gen.next().value).toEqual(call(registerUser, creds));

    // Success case
    const clone = gen.clone();

    const data = { access_token: 'test' };
    expect(clone.next(data).value).toEqual(call(saveTokens, data));
    expect(clone.next().value).toEqual(put({ type: 'SIGNUP_SUCCESS' }));
    expect(clone.next().value).toEqual(put({ type: 'LOGIN_SUCCESS' }));
    expect(clone.next().done).toBeTruthy();

    // Failure case
    let message = 'oops';
    expect(gen.throw({ message }).value).toEqual(put({ type: 'SIGNUP_FAILURE' }));
    expect(gen.next().value).toEqual(call(putError, message));
    expect(gen.next().done).toBeTruthy();
});

// Init
test('handleInitRequest', () => {
    const gen = cloneableGenerator(handleInitRequest)(true);

    expect(gen.next().value).toEqual(call(getToken, false));

    let clone = gen.clone();

    const token = 'token';
    expect(gen.next(token).value).toEqual(put({ type: 'LOGIN_SUCCESS' }));

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
    const action = { gamename: 'test' };
    const gen = cloneableGenerator(handleGameCreateRequest)(action);

    expect(gen.next().value).toEqual(call(authorizedPostRequest, '/game', { name: 'test' }));

    let clone = gen.clone();

    // Successful request
    expect(gen.next().value).toEqual(put({ type: 'GAME_CREATE_SUCCESS' }));
    expect(gen.next().value).toEqual(put({ type: 'GAME_LIST_REQUEST' }));
    expect(gen.next().done).toBeTruthy();

    // Failed request
    let message = 'message';
    expect(clone.throw({ message }).value).toEqual(put({ type: 'GAME_CREATE_FAILURE' }));
    expect(clone.next().value).toEqual(call(putError, message));
    expect(clone.next().done).toBeTruthy();
});

test('handleGameListRequest', () => {
    const gen = cloneableGenerator(handleGameListRequest)();

    expect(gen.next().value).toEqual(call(authorizedGetRequest, '/game'));

    let clone = gen.clone();

    // Successful request
    const data: { games: Array<GameType> } = { games: [{ id: '2', name: 'test' }, { id: '1', name: 'test2' }] };
    expect(gen.next(data).value).toEqual(
        put({
            type: 'GAME_LIST_SUCCESS',
            allIds: ['2', '1'],
            byId: {
                '1': { id: '1', name: 'test2' },
                '2': { id: '2', name: 'test' },
            },
        }),
    );
    expect(gen.next().done).toBeTruthy();

    // Failed request
    let message = 'message';
    expect(clone.throw({ message }).value).toEqual(put({ type: 'GAME_LIST_FAILURE' }));
    expect(clone.next().value).toEqual(call(putError, message));
    expect(clone.next().done).toBeTruthy();
});

test('handleGameSelectRequest', () => {
    const action = { id: 123, updateCardSets: true };
    const gen = cloneableGenerator(handleGameSelectRequest)(action);

    expect(gen.next().value).toEqual(call(authorizedGetRequest, '/game/123'));

    let clone = gen.clone();

    // Successful request
    const data: { cardsets: Array<CardSetType> } = {
        cardsets: [{ id: '2', name: 'test' }, { id: '1', name: 'test2' }],
    };

    expect(gen.next(data).value).toEqual(put({ type: 'GAME_SELECT_SUCCESS', id: 123 }));
    expect(gen.next().value).toEqual(
        put({
            type: 'CARDSET_LIST_SUCCESS',
            allIds: ['2', '1'],
            byId: {
                '1': { id: '1', name: 'test2' },
                '2': { id: '2', name: 'test' },
            },
        }),
    );
    expect(gen.next().done).toBeTruthy();

    // Failed request
    let message = 'message';
    expect(clone.throw({ message }).value).toEqual(put({ type: 'GAME_SELECT_FAILURE' }));
    expect(clone.next().value).toEqual(call(putError, message));
    expect(clone.next().done).toBeTruthy();
});

test('handleGameSelectRequest with updateCardSets set to false', () => {
    const action = { type: 'GAME_SELECT_REQUEST', id: '123', updateCardSets: false };
    const gen = handleGameSelectRequest(action);

    expect(gen.next().value).toEqual(call(authorizedGetRequest, '/game/123'));
    expect(gen.next({}).value).toEqual(put({ type: 'GAME_SELECT_SUCCESS', id: '123' }));
    expect(gen.next().done).toBeTruthy();
});

test('handleCardSetCreateRequest', () => {
    const action = { cardsetname: 'test', game_id: '666' };
    const gen = cloneableGenerator(handleCardSetCreateRequest)(action);

    expect(gen.next().value).toEqual(
        call(authorizedPostRequest, '/cardset', { name: 'test', game_id: '666', data: '{}' }),
    );

    let clone = gen.clone();

    // Successful request
    expect(gen.next().value).toEqual(put({ type: 'CARDSET_CREATE_SUCCESS' }));
    expect(gen.next().value).toEqual(put(gameSelectRequest('666', true)));
    expect(gen.next().done).toBeTruthy();

    // Failed request
    let message = 'message';
    expect(clone.throw({ message }).value).toEqual(put({ type: 'CARDSET_CREATE_FAILURE' }));
    expect(clone.next().value).toEqual(call(putError, message));
    expect(clone.next().done).toBeTruthy();
});

test('handleCardSetSelectRequest', () => {
    const action = { id: '345' };
    const gen = cloneableGenerator(handleCardSetSelectRequest)(action);

    expect(gen.next().value).toEqual(call(authorizedGetRequest, '/cardset/345'));

    let clone = gen.clone();

    // Successful request
    expect(gen.next({ id: '345', name: 'test', data: '{}', game_id: '666' }).value).toEqual(
        put({ type: 'CARDSET_SELECT_SUCCESS', id: '345', name: 'test', data: {} }),
    );
    expect(gen.next().value).toEqual(put(gameSelectRequest('666', false)));
    expect(gen.next().done).toBeTruthy();

    // Failed request
    let message = 'message';
    expect(clone.throw({ message }).value).toEqual(put({ type: 'CARDSET_SELECT_FAILURE' }));
    expect(clone.next().value).toEqual(call(putError, message));
    expect(clone.next().done).toBeTruthy();
});

test('handleCardSetChange', () => {
    const card: CardType = { id: shortid.generate(), count: 1 };

    const action: CardSetSelectAction = {
        type: 'CARDSET_REMOVE_CARD',
        card,
    };
    const gen = cloneableGenerator(handleCardSetChange)(action);

    expect(gen.next().value).toEqual(call(delay, 1000));

    const state: { cardsets: CardSetState } = {
        cardsets: {
            byId: { '123': { id: '123', name: 'name' } },
            allIds: [],
            activity: 0,
            active: '123',
            template: {
                texts: {},
                images: {},
            },
            cardsById: {},
            cardsAllIds: [],
            texts: {},
        },
    };

    expect(gen.next().value).toEqual(select());
    expect(gen.next(state).value).toEqual(
        call(authorizedPutRequest, '/cardset/123', {
            data: JSON.stringify({ cardsAllIds: [], cardsById: {}, template: { texts: {}, images: {} }, texts: {} }),
            name: 'name',
        }),
    );

    let clone = gen.clone();

    // Successful request
    expect(gen.next().value).toEqual(put({ type: 'CARDSET_UPDATE_DATA_SUCCESS' }));
    expect(gen.next().done).toBeTruthy();

    // Failed request
    let message = 'message';
    expect(clone.throw({ message }).value).toEqual(put({ type: 'CARDSET_UPDATE_DATA_FAILURE' }));
    expect(clone.next().value).toEqual(call(putError, message));
    expect(clone.next().done).toBeTruthy();
});
