// @flow
import { type AuthState, type GameState, type SignUpState, auth, games, signup } from './reducers';

test('auth', () => {
    let username = 'test_user';
    let password = 'test_pass';
    let creds = { username, password };
    let type = 'LOGIN_REQUEST';

    let state: AuthState = {
        user: '',
        isAuthenticated: false,
        errorMessage: '',
    };

    expect(auth(state, { type, creds })).toEqual({ isAuthenticated: false, user: username, errorMessage: '' });

    type = 'LOGIN_SUCCESS';
    expect(auth(state, { type, creds })).toEqual({ isAuthenticated: true, user: '', errorMessage: '' });

    type = 'LOGIN_FAILURE';
    let message = 'error message';
    expect(auth(state, { type, creds, message })).toEqual({ isAuthenticated: false, user: '', errorMessage: message });

    type = 'LOGOUT_SUCCESS';
    expect(auth(state, { type, creds, message })).toEqual({ isAuthenticated: false, user: '', errorMessage: '' });
});

test('signup', () => {
    let type = 'SIGNUP_REQUEST';

    let state: SignUpState = {
        signingup: false,
        errorMessage: '',
    };

    expect(signup(state, { type })).toEqual({ signingup: true, errorMessage: '' });

    type = 'SIGNUP_SUCCESS';
    expect(signup(state, { type })).toEqual({ signingup: false, errorMessage: '' });

    type = 'SIGNUP_FAILURE';
    let message = 'error message';
    expect(signup(state, { type, message })).toEqual({ signingup: false, errorMessage: message });
});

test('game', () => {
    let type = 'GAME_CREATE_REQUEST';
    let creating = true;
    let message = 'error message';

    let state: GameState = {
        creating: false,
        listing: false,
        gamelist: [],
        errorMessage: '',
    };

    expect(games(state, { type, gamename: 'test' })).toEqual({
        creating,
        errorMessage: '',
        gamelist: [],
        listing: false,
    });

    type = 'GAME_CREATE_SUCCESS';
    expect(games(state, { type })).toEqual({ creating: false, errorMessage: '', gamelist: [], listing: false });

    type = 'GAME_CREATE_FAILURE';
    expect(games(state, { type, message })).toEqual({
        creating: false,
        errorMessage: message,
        gamelist: [],
        listing: false,
    });

    type = 'GAME_LIST_REQUEST';
    expect(games(state, { type })).toEqual({ creating: false, errorMessage: '', gamelist: [], listing: true });

    type = 'GAME_LIST_SUCCESS';
    let gamelist = [{ id: 1, name: 'test', data: 'test' }];
    expect(games(state, { type, gamelist })).toEqual({ creating: false, errorMessage: '', gamelist, listing: false });

    type = 'GAME_LIST_FAILURE';
    expect(games(state, { type, message })).toEqual({
        creating: false,
        errorMessage: message,
        gamelist: [],
        listing: false,
    });
});
