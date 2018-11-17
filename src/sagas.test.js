import { call, put } from 'redux-saga/effects';
import { login, logout, getToken, validateToken } from './sagas';
import { saveTokens, saveAccessToken, getTokenFromStorage, getRefreshTokenFromStorage, cleanTokens } from './storage';
import { getTokens, refreshToken, deleteAccessToken, deleteRefreshToken } from './requests';
import { cloneableGenerator } from 'redux-saga/utils';
import jwt from 'jwt-simple';

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

test('login', () => {
    const creds = { username: 'username', password: 'password' };
    const gen = cloneableGenerator(login)({ creds });

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
    expect(clone2.throw({ response: { data: { message } } }).value).toEqual(
        put({ type: 'LOGIN_FAILURE', message: message }),
    );
    expect(clone2.next().done).toBeTruthy();
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

test('logout', () => {
    const gen = cloneableGenerator(logout)(true);

    expect(gen.next().value).toEqual(call(getTokenFromStorage));

    let clone = gen.clone();

    const token = 'token';
    expect(clone.next(token).value).toEqual(call(validateToken, token));
    expect(clone.next(true).value).toEqual(call(deleteAccessToken, token));

    expect(gen.next(null).value).toEqual(call(getRefreshTokenFromStorage));

    clone = gen.clone();

    const refresh_token = 'refresh_token';
    expect(clone.next(refresh_token).value).toEqual(call(validateToken, refresh_token));
    expect(clone.next(true).value).toEqual(call(deleteRefreshToken, refresh_token));

    expect(gen.next(null).value).toEqual(call(cleanTokens));
    expect(gen.next().value).toEqual(put({ type: 'LOGOUT_SUCCESS' }));
    expect(gen.next().done).toBeTruthy();
});

test('logout failure', () => {
    const gen = cloneableGenerator(logout)(true);

    expect(gen.next().value).toEqual(call(getTokenFromStorage));

    let message = 'oops';
    expect(gen.throw({ response: { data: { message } } }).value).toEqual(
        put({ type: 'LOGOUT_FAILURE', message: message }),
    );
    expect(gen.next().done).toBeTruthy();
});
