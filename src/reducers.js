// @flow
import { combineReducers } from 'redux';

export type GameType = {
    id: number,
    name: string,
    data?: string,
};

export type AuthState = {
    +isAuthenticated: boolean,
    +user: string,
    +errorMessage: string,
};

export type GameState = {
    +gamelist: Array<GameType>,
    +creating: boolean,
    +listing: boolean,
    +errorMessage: string,
};

export type Credentials = { username: string, password: string };

export type InitAction = { type: 'INIT_REQUEST' };

export type LoginAction =
    | { type: 'LOGIN_REQUEST', creds: Credentials }
    | { type: 'LOGIN_SUCCESS' }
    | { type: 'LOGIN_FAILURE', message: string }
    | { type: 'LOGOUT_SUCCESS' };

export type GameCreateAction =
    | { type: 'GAME_CREATE_REQUEST', gamename: string }
    | { type: 'GAME_CREATE_SUCCESS' }
    | { type: 'GAME_CREATE_FAILURE', message: string };

export type GameListAction =
    | { type: 'GAME_LIST_REQUEST' }
    | { type: 'GAME_LIST_SUCCESS', gamelist: Array<GameType> }
    | { type: 'GAME_LIST_FAILURE', message: string };

export type GameAction = GameCreateAction | GameListAction;

export type Action = InitAction | LoginAction | GameAction;

export function auth(
    state: AuthState = {
        isAuthenticated: false,
        user: '',
        errorMessage: '',
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
                errorMessage: '',
            });
        case 'LOGIN_FAILURE':
            return Object.assign({}, state, {
                isAuthenticated: false,
                errorMessage: action.message,
            });
        case 'LOGOUT_SUCCESS':
            return Object.assign({}, state, {
                isAuthenticated: false,
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
        errorMessage: '',
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
        case 'GAME_CREATE_FAILURE':
            return Object.assign({}, state, {
                errorMessage: action.message,
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
        case 'GAME_LIST_FAILURE':
            return Object.assign({}, state, {
                errorMessage: action.message,
            });
        default:
            return state;
    }
}

const reducers = combineReducers({
    auth,
    games,
});

export default reducers;
