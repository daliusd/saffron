// @flow

import type { Credentials } from './reducers';

export const initRequest = () => {
    return { type: 'INIT_REQUEST' };
};

export const loginRequest = (creds: Credentials) => {
    return {
        type: 'LOGIN_REQUEST',
        creds: creds,
    };
};

export const logoutRequest = () => {
    return {
        type: 'LOGOUT_REQUEST',
    };
};

export const gameCreateRequest = (gamename: string) => {
    return {
        type: 'GAME_CREATE_REQUEST',
        gamename: gamename,
    };
};

export const gameListRequest = () => {
    return {
        type: 'GAME_LIST_REQUEST',
    };
};
