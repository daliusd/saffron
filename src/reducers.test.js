import { auth, quotes } from './reducers';

test('auth', () => {
    let username = 'test_user';
    let creds = { username };
    let type = 'LOGIN_REQUEST';
    expect(auth({}, { type, creds })).toEqual({ isAuthenticated: false, user: username });

    type = 'LOGIN_SUCCESS';
    expect(auth({}, { type, creds })).toEqual({ isAuthenticated: true, errorMessage: '' });

    type = 'LOGIN_FAILURE';
    let message = 'error message';
    expect(auth({}, { type, creds, message })).toEqual({ isAuthenticated: false, errorMessage: message });

    type = 'LOGOUT_SUCCESS';
    expect(auth({}, { type, creds, message })).toEqual({ isAuthenticated: false });

    type = 'RANDOM_MESSAGE';
    expect(auth({}, { type })).toEqual({});
});

test('auth', () => {
    let type = 'QUOTE_REQUEST';
    let quote = 'some quote';
    let authenticated = true;
    let message = 'error message';

    expect(quotes({}, { type })).toEqual({});

    type = 'QUOTE_SUCCESS';
    expect(quotes({}, { type, quote, authenticated })).toEqual({ quote, authenticated });

    type = 'QUOTE_FAILURE';
    expect(quotes({}, { type, message })).toEqual({ errorMessage: message });
});
