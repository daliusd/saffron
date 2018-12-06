// @flow

import shortid from 'shortid';

export type MessageType = {
    id: string,
    type: string,
    text: string,
};

export type GameType = {
    id: number,
    name: string,
};

export type CardSetType = {
    id: number,
    name: string,
    data?: string,
};

export type Credentials = { username: string, password: string };

export type InitAction = { type: 'INIT_REQUEST' };

export type MessageAction =
    | { type: 'MESSAGE_DISPLAY', message: MessageType }
    | { type: 'MESSAGE_HIDE', message: MessageType };

export type LoginAction =
    | { type: 'LOGIN_REQUEST', creds: Credentials }
    | { type: 'LOGIN_SUCCESS' }
    | { type: 'LOGIN_FAILURE', message: string }
    | { type: 'LOGOUT_REQUEST' }
    | { type: 'LOGOUT_FAILURE' }
    | { type: 'LOGOUT_SUCCESS' };

export type SignUpAction = { type: 'SIGNUP_REQUEST' } | { type: 'SIGNUP_SUCCESS' } | { type: 'SIGNUP_FAILURE' };

export type GameCreateAction =
    | { type: 'GAME_CREATE_REQUEST', gamename: string }
    | { type: 'GAME_CREATE_SUCCESS' }
    | { type: 'GAME_CREATE_FAILURE' };

export type GameListAction =
    | { type: 'GAME_LIST_REQUEST' }
    | { type: 'GAME_LIST_SUCCESS', games: Array<GameType> }
    | { type: 'GAME_LIST_FAILURE' };

export type GameSelectAction =
    | { type: 'GAME_SELECT_REQUEST', id: number }
    | { type: 'GAME_SELECT_SUCCESS' }
    | { type: 'GAME_SELECT_FAILURE' };

export type CardSetCreateAction =
    | { type: 'CARDSET_CREATE_REQUEST', cardsetname: string, game_id: number }
    | { type: 'CARDSET_CREATE_SUCCESS' }
    | { type: 'CARDSET_CREATE_FAILURE' };

export type CardSetListAction =
    | { type: 'CARDSET_LIST_REQUEST' }
    | { type: 'CARDSET_LIST_SUCCESS', cardsets: Array<CardSetType> }
    | { type: 'CARDSET_LIST_FAILURE' };

export type GameAction = GameCreateAction | GameListAction | GameSelectAction;

export type CardSetAction = CardSetCreateAction | CardSetListAction;

export type Action = InitAction | LoginAction | SignUpAction | GameAction | CardSetAction | MessageAction;

export type Dispatch = (action: Action) => any;

export const messageRequest = (type: string, text: string): MessageAction => {
    return {
        type: 'MESSAGE_DISPLAY',
        message: {
            id: shortid.generate(),
            type: type,
            text: text,
        },
    };
};

export const initRequest = (): InitAction => {
    return { type: 'INIT_REQUEST' };
};

export const loginRequest = (creds: Credentials): LoginAction => {
    return {
        type: 'LOGIN_REQUEST',
        creds: creds,
    };
};

export const logoutRequest = (): LoginAction => {
    return {
        type: 'LOGOUT_REQUEST',
    };
};

export const signupRequest = (creds: Credentials): SignUpAction => {
    return {
        type: 'SIGNUP_REQUEST',
        creds: creds,
    };
};

export const gameCreateRequest = (gamename: string): GameAction => {
    return {
        type: 'GAME_CREATE_REQUEST',
        gamename: gamename,
    };
};

export const gameListRequest = (): GameAction => {
    return {
        type: 'GAME_LIST_REQUEST',
    };
};

export const gameSelectRequest = (id: number): GameAction => {
    return {
        type: 'GAME_SELECT_REQUEST',
        id,
    };
};

export const cardSetCreateRequest = (cardsetname: string, game_id: number): CardSetAction => {
    return {
        type: 'CARDSET_CREATE_REQUEST',
        cardsetname: cardsetname,
        game_id,
    };
};
