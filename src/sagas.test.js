import { call, put } from 'redux-saga/effects';
import { login, getTokens, saveTokens } from './sagas';
import { cloneableGenerator } from 'redux-saga/utils';

test('login', () => {
    const creds = { username: 'username', password: 'password' };
    const gen = cloneableGenerator(login)({ creds });

    const clone = gen.clone();

    expect(clone.next().value).toEqual(call(getTokens, creds));
    const data = { access_token: 'test' };
    expect(clone.next(data).value).toEqual(call(saveTokens, data));
    expect(clone.next().value).toEqual(put({ type: 'LOGIN_SUCCESS' }));
    expect(clone.next().done).toBeTruthy();

    const clone2 = gen.clone();
    expect(clone2.next().value).toEqual(call(getTokens, creds));
    let message = 'oops';
    expect(clone2.throw({ response: { data: { message } } }).value).toEqual(
        put({ type: 'LOGIN_FAILURE', message: message }),
    );
    expect(clone2.next().done).toBeTruthy();
});
