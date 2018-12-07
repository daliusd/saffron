// @flow
import { combineReducers } from 'redux';

import type {
    CardSetAction,
    CardSetType,
    GameAction,
    GamesCollection,
    IdsArray,
    LoginAction,
    MessageAction,
    MessageType,
    SignUpAction,
} from './actions';

export const ACTIVITY_CREATING = 0x1;
export const ACTIVITY_LISTING = 0x2;
export const ACTIVITY_SELECTING = 0x4;

export type MessageState = {
    messages: Array<MessageType>,
};

export type AuthState = {
    +isAuthenticated: boolean,
    +user: string,
};

export type SignUpState = {
    +signingup: boolean,
};

export type GameState = {
    +byId: GamesCollection,
    +allIds: IdsArray,
    +activity: number,
    +active: ?number,
};

export type CardSetState = {
    +cardsetlist: Array<CardSetType>,
    +activity: number,
    +active: ?number,
};

export function message(
    state: MessageState = {
        messages: [],
    },
    action: MessageAction,
): MessageState {
    switch (action.type) {
        case 'MESSAGE_DISPLAY':
            return Object.assign({}, state, {
                messages: state.messages.concat(action.message),
            });
        case 'MESSAGE_HIDE':
            return Object.assign({}, state, {
                messages: state.messages.filter(m => m.id !== action.message.id),
            });
        default:
            return state;
    }
}

export function auth(
    state: AuthState = {
        isAuthenticated: false,
        user: '',
    },
    action: LoginAction,
): AuthState {
    switch (action.type) {
        case 'LOGIN_REQUEST':
            return Object.assign({}, state, {
                isAuthenticated: false,
                user: action.creds.username,
            });
        case 'LOGIN_SUCCESS':
            return Object.assign({}, state, {
                isAuthenticated: true,
            });
        case 'LOGIN_FAILURE':
            return Object.assign({}, state, {
                isAuthenticated: false,
            });
        case 'LOGOUT_SUCCESS':
            return Object.assign({}, state, {
                isAuthenticated: false,
            });
        default:
            return state;
    }
}

export function signup(
    state: SignUpState = {
        signingup: false,
    },
    action: SignUpAction,
): SignUpState {
    switch (action.type) {
        case 'SIGNUP_REQUEST':
            return Object.assign({}, state, {
                signingup: true,
            });
        case 'SIGNUP_SUCCESS':
            return Object.assign({}, state, {
                signingup: false,
            });
        case 'SIGNUP_FAILURE':
            return Object.assign({}, state, {
                signingup: false,
            });
        default:
            return state;
    }
}

export function games(
    state: GameState = {
        byId: {},
        allIds: [],
        activity: 0,
        active: null,
    },
    action: GameAction,
): GameState {
    switch (action.type) {
        case 'GAME_CREATE_REQUEST':
            return Object.assign({}, state, {
                activity: state.activity | ACTIVITY_CREATING,
            });
        case 'GAME_CREATE_SUCCESS':
            return Object.assign({}, state, {
                activity: state.activity & ~ACTIVITY_CREATING,
            });
        case 'GAME_CREATE_FAILURE':
            return Object.assign({}, state, {
                activity: state.activity & ~ACTIVITY_CREATING,
            });
        case 'GAME_LIST_REQUEST':
            return Object.assign({}, state, {
                activity: state.activity | ACTIVITY_LISTING,
            });
        case 'GAME_LIST_SUCCESS':
            return Object.assign({}, state, {
                activity: state.activity & ~ACTIVITY_LISTING,
                byId: action.byId,
                allIds: action.allIds,
            });
        case 'GAME_LIST_FAILURE':
            return Object.assign({}, state, {
                activity: state.activity & ~ACTIVITY_LISTING,
            });
        case 'GAME_SELECT_REQUEST':
            return Object.assign({}, state, {
                activity: ACTIVITY_SELECTING,
                active: action.id,
            });
        case 'GAME_SELECT_SUCCESS':
            return Object.assign({}, state, {
                activity: state.activity & ~ACTIVITY_SELECTING,
            });
        case 'GAME_SELECT_FAILURE':
            return Object.assign({}, state, {
                activity: state.activity & ~ACTIVITY_SELECTING,
            });
        default:
            return state;
    }
}

export function cardsets(
    state: CardSetState = {
        cardsetlist: [],
        activity: 0,
        active: null,
    },
    action: CardSetAction,
): CardSetState {
    switch (action.type) {
        case 'CARDSET_CREATE_REQUEST':
            return Object.assign({}, state, {
                activity: state.activity | ACTIVITY_CREATING,
            });
        case 'CARDSET_CREATE_SUCCESS':
            return Object.assign({}, state, {
                activity: state.activity & ~ACTIVITY_CREATING,
            });
        case 'CARDSET_CREATE_FAILURE':
            return Object.assign({}, state, {
                activity: state.activity & ~ACTIVITY_CREATING,
            });
        case 'CARDSET_LIST_REQUEST':
            return Object.assign({}, state, {
                activity: state.activity | ACTIVITY_LISTING,
            });
        case 'CARDSET_LIST_SUCCESS':
            return Object.assign({}, state, {
                activity: state.activity & ~ACTIVITY_LISTING,
                cardsetlist: action.cardsets,
            });
        case 'CARDSET_LIST_FAILURE':
            return Object.assign({}, state, {
                activity: state.activity & ~ACTIVITY_LISTING,
            });
        case 'CARDSET_SELECT_REQUEST':
            return Object.assign({}, state, {
                activity: state.activity | ACTIVITY_SELECTING,
                active: action.id,
            });
        case 'CARDSET_SELECT_SUCCESS':
            return Object.assign({}, state, {
                activity: state.activity & ~ACTIVITY_SELECTING,
                cardsetlist: [
                    ...state.cardsetlist,
                    {
                        id: action.id,
                        name: action.name,
                        data: action.data,
                    },
                ],
            });
        case 'CARDSET_SELECT_FAILURE':
            return Object.assign({}, state, {
                activity: state.activity & ~ACTIVITY_SELECTING,
            });
        default:
            return state;
    }
}

const reducers = combineReducers({
    message,
    auth,
    signup,
    games,
    cardsets,
});

export default reducers;
