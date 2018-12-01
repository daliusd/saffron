// @flow
import {
    type AuthState,
    type GameState,
    type MessageState,
    type SignUpState,
    auth,
    games,
    message,
    signup,
} from './reducers';
import type { MessageType } from './actions';

test('message', () => {
    const testMessage1: MessageType = { id: 'test2', type: 'error', text: 'text' };
    const testMessage2: MessageType = { id: 'test2', type: 'error', text: 'text' };

    const state: MessageState = {
        messages: [testMessage2],
    };

    let type = 'MESSAGE_DISPLAY';

    expect(message(state, { type, message: testMessage1 })).toEqual({ messages: [testMessage2, testMessage1] });

    type = 'MESSAGE_HIDE';
    expect(message(state, { type, message: testMessage2 })).toEqual({ messages: [] });
});

test('auth', () => {
    let username = 'test_user';
    let password = 'test_pass';
    let creds = { username, password };
    let type = 'LOGIN_REQUEST';

    let state: AuthState = {
        user: '',
        isAuthenticated: false,
    };

    expect(auth(state, { type, creds })).toEqual({ isAuthenticated: false, user: username });

    type = 'LOGIN_SUCCESS';
    expect(auth(state, { type, creds })).toEqual({ isAuthenticated: true, user: '' });

    type = 'LOGIN_FAILURE';
    let message = 'error message';
    expect(auth(state, { type, creds, message })).toEqual({ isAuthenticated: false, user: '' });

    type = 'LOGOUT_SUCCESS';
    expect(auth(state, { type, creds, message })).toEqual({ isAuthenticated: false, user: '' });
});

test('signup', () => {
    let type = 'SIGNUP_REQUEST';

    let state: SignUpState = {
        signingup: false,
    };

    expect(signup(state, { type })).toEqual({ signingup: true });

    type = 'SIGNUP_SUCCESS';
    expect(signup(state, { type })).toEqual({ signingup: false });

    type = 'SIGNUP_FAILURE';
    let message = 'error message';
    expect(signup(state, { type, message })).toEqual({ signingup: false });
});

test('game', () => {
    let type = 'GAME_CREATE_REQUEST';
    let creating = true;
    let message = 'error message';

    let state: GameState = {
        creating: false,
        listing: false,
        gamelist: [],
    };

    expect(games(state, { type, gamename: 'test' })).toEqual({
        creating,
        gamelist: [],
        listing: false,
    });

    type = 'GAME_CREATE_SUCCESS';
    expect(games(state, { type })).toEqual({ creating: false, gamelist: [], listing: false });

    type = 'GAME_CREATE_FAILURE';
    expect(games(state, { type, message })).toEqual({
        creating: false,
        gamelist: [],
        listing: false,
    });

    type = 'GAME_LIST_REQUEST';
    expect(games(state, { type })).toEqual({ creating: false, gamelist: [], listing: true });

    type = 'GAME_LIST_SUCCESS';
    let gamelist = [{ id: 1, name: 'test', data: 'test' }];
    expect(games(state, { type, gamelist })).toEqual({ creating: false, gamelist, listing: false });

    type = 'GAME_LIST_FAILURE';
    expect(games(state, { type, message })).toEqual({
        creating: false,
        gamelist: [],
        listing: false,
    });
});
