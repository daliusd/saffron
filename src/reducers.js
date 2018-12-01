// @flow
import { combineReducers } from 'redux';

import type { GameAction, GameType, LoginAction, MessageAction, MessageType, SignUpAction } from './actions';

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
    +gamelist: Array<GameType>,
    +creating: boolean,
    +listing: boolean,
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
        gamelist: [],
        creating: false,
        listing: false,
    },
    action: GameAction,
): GameState {
    switch (action.type) {
        case 'GAME_CREATE_REQUEST':
            return Object.assign({}, state, {
                creating: true,
            });
        case 'GAME_CREATE_SUCCESS':
            return Object.assign({}, state, {
                creating: false,
            });
        case 'GAME_LIST_REQUEST':
            return Object.assign({}, state, {
                listing: true,
            });
        case 'GAME_LIST_SUCCESS':
            return Object.assign({}, state, {
                listing: false,
                gamelist: action.gamelist,
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
});

export default reducers;
