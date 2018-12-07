// @flow
import {
    ACTIVITY_CREATING,
    ACTIVITY_LISTING,
    ACTIVITY_SELECTING,
    type AuthState,
    type MessageState,
    type SignUpState,
    auth,
    cardsets,
    games,
    message,
    signup,
} from './reducers';
import type { CardSetType, GamesCollection, IdsArray, MessageType } from './actions';

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
    let username = 'test_user';
    let password = 'test_pass';
    let creds = { username, password };
    let type = 'SIGNUP_REQUEST';

    let state: SignUpState = {
        signingup: false,
    };

    expect(signup(state, { type, creds })).toEqual({ signingup: true });

    type = 'SIGNUP_SUCCESS';
    expect(signup(state, { type })).toEqual({ signingup: false });

    type = 'SIGNUP_FAILURE';
    let message = 'error message';
    expect(signup(state, { type, message })).toEqual({ signingup: false });
});

test('GAME_CREATE', () => {
    let message = 'error message';

    let type = 'GAME_CREATE_REQUEST';
    expect(
        games(
            {
                activity: 0,
                byId: {},
                allIds: [],
                active: null,
            },
            { type, gamename: 'test' },
        ),
    ).toEqual({
        byId: {},
        allIds: [],
        activity: ACTIVITY_CREATING,
        active: null,
    });

    type = 'GAME_CREATE_SUCCESS';
    expect(
        games(
            {
                activity: ACTIVITY_CREATING,
                byId: {},
                allIds: [],
                active: null,
            },
            { type },
        ),
    ).toEqual({ activity: 0, byId: {}, allIds: [], active: null });

    type = 'GAME_CREATE_FAILURE';
    expect(
        games(
            {
                activity: ACTIVITY_CREATING,
                byId: {},
                allIds: [],
                active: null,
            },
            { type, message },
        ),
    ).toEqual({
        activity: 0,
        byId: {},
        allIds: [],
        active: null,
    });
});

test('GAME_LIST', () => {
    let message = 'error message';

    let type = 'GAME_LIST_REQUEST';
    expect(
        games(
            {
                activity: 0,
                byId: {},
                allIds: [],
                active: null,
            },
            { type },
        ),
    ).toEqual({ activity: ACTIVITY_LISTING, byId: {}, allIds: [], active: null });

    type = 'GAME_LIST_SUCCESS';
    let byId: GamesCollection = { '1': { id: 1, name: 'test' } };
    let allIds: IdsArray = [1];
    expect(
        games(
            {
                activity: ACTIVITY_LISTING,
                byId: {},
                allIds: [],
                active: null,
            },
            { type, byId, allIds },
        ),
    ).toEqual({
        activity: 0,
        byId,
        allIds,
        active: null,
    });

    type = 'GAME_LIST_FAILURE';
    expect(
        games(
            {
                activity: ACTIVITY_LISTING,
                byId: {},
                allIds: [],
                active: null,
            },
            { type, message },
        ),
    ).toEqual({
        activity: 0,
        byId: {},
        allIds: [],
        active: null,
    });
});

test('GAME_SELECT', () => {
    let message = 'error message';

    let type = 'GAME_SELECT_REQUEST';
    expect(
        games(
            {
                activity: 0,
                byId: {},
                allIds: [],
                active: null,
            },
            { type, id: 1 },
        ),
    ).toEqual({ activity: ACTIVITY_SELECTING, byId: {}, allIds: [], active: 1 });

    type = 'GAME_SELECT_SUCCESS';
    expect(
        games(
            {
                activity: ACTIVITY_SELECTING,
                byId: {},
                allIds: [],
                active: null,
            },
            { type },
        ),
    ).toEqual({
        activity: 0,
        byId: {},
        allIds: [],
        active: null,
    });

    type = 'GAME_SELECT_FAILURE';
    expect(
        games(
            {
                activity: ACTIVITY_SELECTING,
                byId: {},
                allIds: [],
                active: null,
            },
            { type, message },
        ),
    ).toEqual({
        activity: 0,
        byId: {},
        allIds: [],
        active: null,
    });
});

test('CARDSET_CREATE', () => {
    let message = 'error message';

    let type = 'CARDSET_CREATE_REQUEST';
    expect(
        cardsets(
            {
                activity: 0,
                cardsetlist: [],
                active: null,
            },
            { type, cardsetname: 'test', game_id: 1 },
        ),
    ).toEqual({
        cardsetlist: [],
        activity: ACTIVITY_CREATING,
        active: null,
    });

    type = 'CARDSET_CREATE_SUCCESS';
    expect(
        cardsets(
            {
                activity: ACTIVITY_CREATING,
                cardsetlist: [],
                active: null,
            },
            { type },
        ),
    ).toEqual({ activity: 0, cardsetlist: [], active: null });

    type = 'CARDSET_CREATE_FAILURE';
    expect(
        cardsets(
            {
                activity: ACTIVITY_CREATING,
                cardsetlist: [],
                active: null,
            },
            { type, message },
        ),
    ).toEqual({
        activity: 0,
        cardsetlist: [],
        active: null,
    });
});

test('CARDSET_LIST', () => {
    let message = 'error message';

    let type = 'CARDSET_LIST_REQUEST';
    expect(
        cardsets(
            {
                activity: 0,
                cardsetlist: [],
                active: null,
            },
            { type },
        ),
    ).toEqual({ activity: ACTIVITY_LISTING, cardsetlist: [], active: null });

    type = 'CARDSET_LIST_SUCCESS';
    let cardsetlist: Array<CardSetType> = [{ id: 1, name: 'test', data: {} }];
    expect(
        cardsets(
            {
                activity: ACTIVITY_LISTING,
                cardsetlist: [],
                active: null,
            },
            { type, cardsets: cardsetlist },
        ),
    ).toEqual({
        activity: 0,
        cardsetlist,
        active: null,
    });

    type = 'CARDSET_LIST_FAILURE';
    expect(
        cardsets(
            {
                activity: ACTIVITY_LISTING,
                cardsetlist: [],
                active: null,
            },
            { type, message },
        ),
    ).toEqual({
        activity: 0,
        cardsetlist: [],
        active: null,
    });
});

test('CARDSET_SELECT', () => {
    let message = 'error message';

    let type = 'CARDSET_SELECT_REQUEST';
    expect(
        cardsets(
            {
                activity: 0,
                cardsetlist: [],
                active: null,
            },
            { type, id: 1 },
        ),
    ).toEqual({ activity: ACTIVITY_SELECTING, cardsetlist: [], active: 1 });

    type = 'CARDSET_SELECT_SUCCESS';
    expect(
        cardsets(
            {
                activity: ACTIVITY_SELECTING,
                cardsetlist: [],
                active: null,
            },
            { type, id: 1, name: 'test', data: {} },
        ),
    ).toEqual({
        activity: 0,
        cardsetlist: [{ id: 1, name: 'test', data: {} }],
        active: null,
    });

    type = 'CARDSET_SELECT_FAILURE';
    expect(
        cardsets(
            {
                activity: ACTIVITY_SELECTING,
                cardsetlist: [],
                active: null,
            },
            { type, message },
        ),
    ).toEqual({
        activity: 0,
        cardsetlist: [],
        active: null,
    });
});
