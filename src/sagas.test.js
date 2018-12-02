import { call, put } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import { delay } from 'redux-saga';

import jwt from 'jwt-simple';

import {
    authorizedGetRequest,
    authorizedPostRequest,
    getToken,
    handleGameCreateRequest,
    handleGameListRequest,
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
    refreshToken,
    registerUser,
} from './requests';
import { saveTokens, saveAccessToken, getTokenFromStorage, getRefreshTokenFromStorage, cleanTokens } from './storage';

test('putError', () => {
    putError('random error').next();
});

test('handleMessageDisplay', () => {
    const message = 'message';
    let gen = handleMessageDisplay({ message });
    expect(gen.next().value).toEqual(call(delay, 5000));
    expect(gen.next().value).toEqual(put({ type: 'MESSAGE_HIDE', message }));
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
    const data = 'data';
    const token = 'token';

    const gen = authorizedPostRequest(url, data);

    expect(gen.next().value).toEqual(call(getToken, true));
    expect(gen.next(token).value).toEqual(call(postRequest, url, token, data));
    expect(gen.next().done).toBeTruthy();
});

// Game

test('handleGameCreateRequest', () => {
    const action = { gamename: 'test' };
    const gen = cloneableGenerator(handleGameCreateRequest)(action);

    expect(gen.next().value).toEqual(call(authorizedPostRequest, '/game', { name: 'test', data: '{}' }));

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
    let data = { games: [] };
    expect(gen.next(data).value).toEqual(put({ type: 'GAME_LIST_SUCCESS', games: [] }));
    expect(gen.next().done).toBeTruthy();

    // Failed request
    let message = 'message';
    expect(clone.throw({ message }).value).toEqual(put({ type: 'GAME_LIST_FAILURE' }));
    expect(clone.next().value).toEqual(call(putError, message));
    expect(clone.next().done).toBeTruthy();
});
