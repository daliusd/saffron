import {
    ACTIVITY_SELECTING,
    AuthState,
    DefaultCardSetState,
    MessageState,
    SignUpState,
    auth,
    cardsets,
    games,
    message,
    signup,
    DefaultCardSetsState,
    cardset,
} from './reducers';
import {
    CARDSET_CREATE_FAILURE,
    CARDSET_CREATE_REQUEST,
    CARDSET_CREATE_SUCCESS,
    CARDSET_LIST_FAILURE,
    CARDSET_LIST_REQUEST,
    CARDSET_LIST_RESET,
    CARDSET_LIST_SUCCESS,
    CARDSET_SELECT_REQUEST,
    GAME_CREATE_REQUEST,
    GAME_CREATE_SUCCESS,
    GAME_LIST_FAILURE,
    GAME_LIST_REQUEST,
    GAME_LIST_RESET,
    GAME_LIST_SUCCESS,
    GAME_SELECT_FAILURE,
    GAME_SELECT_REQUEST,
    GAME_SELECT_SUCCESS,
    LOGIN_FAILURE,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGOUT_SUCCESS,
    MESSAGE_DISPLAY,
    MESSAGE_HIDE,
    SIGNUP_FAILURE,
    SIGNUP_REQUEST,
    SIGNUP_SUCCESS,
    CARDSETS_SELECT_SUCCESS,
} from './actions';
import { MessageType, GamesCollection, IdsArray, CardSetsCollection } from './types';

test('message', () => {
    const testMessage1: MessageType = { id: 'test1', type: 'error', text: 'text' };
    const testMessage2: MessageType = { id: 'test2', type: 'error', text: 'text' };

    const state: MessageState = {
        messages: [testMessage2],
    };

    expect(message(state, { type: MESSAGE_DISPLAY, message: testMessage1 })).toEqual({
        messages: [testMessage2, testMessage1],
    });

    expect(message(state, { type: MESSAGE_HIDE, messageId: testMessage2.id })).toEqual({ messages: [] });
});

test('auth', () => {
    const username = 'test_user';
    const password = 'test_pass';
    const creds = { username, password };

    const state: AuthState = {
        user: '',
        isAuthenticated: false,
    };

    expect(auth(state, { type: LOGIN_REQUEST, creds })).toEqual({ isAuthenticated: undefined, user: '' });

    expect(auth(state, { type: LOGIN_SUCCESS, username })).toEqual({ isAuthenticated: true, user: username });

    const message = 'error message';
    expect(auth(state, { type: LOGIN_FAILURE, message })).toEqual({ isAuthenticated: false, user: '' });

    expect(auth(state, { type: LOGOUT_SUCCESS })).toEqual({ isAuthenticated: false, user: '' });
});

test('signup', () => {
    const username = 'test_user';
    const password = 'test_pass';
    const creds = { username, password };

    const state: SignUpState = {
        signingup: false,
    };

    expect(signup(state, { type: SIGNUP_REQUEST, creds })).toEqual({ signingup: true });

    expect(signup(state, { type: SIGNUP_SUCCESS })).toEqual({ signingup: false });

    expect(signup(state, { type: SIGNUP_FAILURE })).toEqual({ signingup: false });
});

test('GAME_CREATE', () => {
    expect(
        games(
            {
                activity: 0,
                byId: {},
                allIds: [],
                active: null,
            },
            { type: GAME_CREATE_REQUEST, gamename: 'test' },
        ),
    ).toEqual({
        byId: {},
        allIds: [],
        activity: 0,
        active: null,
    });

    expect(
        games(
            {
                activity: 0,
                byId: {},
                allIds: [],
                active: null,
            },
            { type: GAME_CREATE_SUCCESS },
        ),
    ).toEqual({ activity: 0, byId: {}, allIds: [], active: null });
});

test('GAME_LIST', () => {
    expect(
        games(
            {
                activity: 0,
                byId: {},
                allIds: [],
                active: null,
            },
            { type: GAME_LIST_REQUEST },
        ),
    ).toEqual({ activity: 0, byId: {}, allIds: [], active: null });

    const byId: GamesCollection = { '1': { id: '1', name: 'test' } };
    const allIds: IdsArray = ['1'];
    expect(
        games(
            {
                activity: 0,
                byId: {},
                allIds: [],
                active: null,
            },
            { type: GAME_LIST_SUCCESS, byId, allIds },
        ),
    ).toEqual({
        activity: 0,
        byId,
        allIds,
        active: null,
    });

    expect(
        games(
            {
                activity: 0,
                byId: {},
                allIds: [],
                active: null,
            },
            { type: GAME_LIST_FAILURE },
        ),
    ).toEqual({
        activity: 0,
        byId: {},
        allIds: [],
        active: null,
    });

    expect(
        games(
            {
                activity: 0,
                byId,
                allIds,
                active: null,
            },
            { type: GAME_LIST_RESET },
        ),
    ).toEqual({
        activity: 0,
        byId: {},
        allIds: [],
        active: null,
    });
});

test('GAME_SELECT', () => {
    expect(
        games(
            {
                activity: 0,
                byId: {},
                allIds: [],
                active: null,
            },
            { type: GAME_SELECT_REQUEST, id: '1', updateCardSets: false },
        ),
    ).toEqual({ activity: ACTIVITY_SELECTING, byId: {}, allIds: [], active: null });

    expect(
        games(
            {
                activity: ACTIVITY_SELECTING,
                byId: {},
                allIds: [],
                active: null,
                attributions: [],
            },
            { type: GAME_SELECT_SUCCESS, id: '123' },
        ),
    ).toEqual({
        activity: 0,
        byId: {},
        allIds: [],
        active: '123',
        attributions: [],
    });

    expect(
        games(
            {
                activity: ACTIVITY_SELECTING,
                byId: {},
                allIds: [],
                active: null,
                attributions: [],
            },
            { type: GAME_SELECT_FAILURE },
        ),
    ).toEqual({
        activity: 0,
        byId: {},
        allIds: [],
        active: null,
        attributions: [],
    });
});

test('CARDSET_CREATE', () => {
    expect(
        cardsets(DefaultCardSetsState, {
            type: CARDSET_CREATE_REQUEST,
            cardsetname: 'test',
            gameId: '1',
            width: 10,
            height: 10,
        }),
    ).toEqual({
        ...DefaultCardSetsState,
    });

    expect(
        cardsets(
            {
                ...DefaultCardSetsState,
            },
            { type: CARDSET_CREATE_SUCCESS },
        ),
    ).toEqual({
        ...DefaultCardSetsState,
    });

    expect(
        cardsets(
            {
                ...DefaultCardSetsState,
            },
            { type: CARDSET_CREATE_FAILURE },
        ),
    ).toEqual({
        ...DefaultCardSetsState,
    });
});

test('CARDSET_LIST', () => {
    expect(
        cardsets(
            {
                ...DefaultCardSetsState,
            },
            { type: CARDSET_LIST_REQUEST },
        ),
    ).toEqual({
        ...DefaultCardSetsState,
    });

    const byId: CardSetsCollection = { '1': { id: '1', name: 'test' } };
    const allIds: IdsArray = ['1'];

    expect(
        cardsets(
            {
                ...DefaultCardSetsState,
            },
            { type: CARDSET_LIST_SUCCESS, byId, allIds },
        ),
    ).toEqual({
        ...DefaultCardSetsState,
        byId,
        allIds,
    });

    expect(
        cardsets(
            {
                ...DefaultCardSetsState,
            },
            { type: CARDSET_LIST_FAILURE },
        ),
    ).toEqual({
        ...DefaultCardSetsState,
    });

    expect(
        cardsets(
            {
                ...DefaultCardSetsState,
            },
            { type: CARDSET_LIST_RESET },
        ),
    ).toEqual({
        ...DefaultCardSetsState,
    });
});

test('CARDSET_SELECT', () => {
    expect(
        cardset(
            {
                ...DefaultCardSetState,
            },
            { type: CARDSET_SELECT_REQUEST, id: '1' },
        ),
    ).toEqual({
        ...DefaultCardSetState,
        activity: ACTIVITY_SELECTING,
    });

    expect(
        cardsets(
            {
                ...DefaultCardSetsState,
                byId: { '1': { id: '1', name: 'test' } },
                allIds: ['1'],
            },
            {
                type: CARDSETS_SELECT_SUCCESS,
                id: '1',
                name: 'test2',
            },
        ),
    ).toEqual({
        ...DefaultCardSetsState,
        byId: { '1': { id: '1', name: 'test2' } },
        allIds: ['1'],
        active: '1',
    });
});
