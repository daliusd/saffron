// @flow

import shortid from 'shortid';

export type IdsArray = Array<number>;

export type MessageType = {
    id: string,
    type: string,
    text: string,
};

export type GameType = {
    id: number,
    name: string,
};

export type GamesCollection = {
    [string]: GameType,
};

export type TextTemplateType = { id: string, x: number, y: number, width: number, height: number, angle: number };
export type TextTemplatesCollection = { [string]: TextTemplateType };
export type CardTemplateType = { texts: TextTemplatesCollection, images: any };

export type TextInfo = { value: string, cursor: number };
export type CardType = { id: string, count: number, texts: { [string]: TextInfo }, images: any };

export type CardSetType = {
    id: number,
    name: string,
    data: {
        template: CardTemplateType,
        cardsAllIds: Array<string>,
        cardsById: { [string]: CardType },
    },
};

export type CardSetsCollection = {
    [string]: CardSetType,
};

export type Credentials = { username: string, password: string };

export type InitAction = { type: 'INIT_REQUEST' };

export type MessageAction =
    | { type: 'MESSAGE_DISPLAY', message: MessageType }
    | { type: 'MESSAGE_HIDE', message: MessageType };

export type LoginRequest = { type: 'LOGIN_REQUEST', creds: Credentials };
export type LoginAction =
    | LoginRequest
    | { type: 'LOGIN_SUCCESS' }
    | { type: 'LOGIN_FAILURE', message: string }
    | { type: 'LOGOUT_REQUEST' }
    | { type: 'LOGOUT_FAILURE' }
    | { type: 'LOGOUT_SUCCESS' };

export type SignUpRequest = { type: 'SIGNUP_REQUEST', creds: Credentials };
export type SignUpAction = SignUpRequest | { type: 'SIGNUP_SUCCESS' } | { type: 'SIGNUP_FAILURE' };

export type GameCreateRequest = { type: 'GAME_CREATE_REQUEST', gamename: string };
export type GameCreateAction = GameCreateRequest | { type: 'GAME_CREATE_SUCCESS' } | { type: 'GAME_CREATE_FAILURE' };

export type GameListSuccess = { type: 'GAME_LIST_SUCCESS', byId: GamesCollection, allIds: IdsArray };
export type GameListAction =
    | { type: 'GAME_LIST_REQUEST' }
    | GameListSuccess
    | { type: 'GAME_LIST_FAILURE' }
    | { type: 'GAME_LIST_RESET' };

export type GameSelectRequest = { type: 'GAME_SELECT_REQUEST', id: number, updateCardSets: boolean };
export type GameSelectAction =
    | GameSelectRequest
    | { type: 'GAME_SELECT_SUCCESS', id: number }
    | { type: 'GAME_SELECT_FAILURE' };

export type GameAction = GameCreateAction | GameListAction | GameSelectAction;

export type CardSetCreateRequest = { type: 'CARDSET_CREATE_REQUEST', cardsetname: string, game_id: number };
export type CardSetCreateAction =
    | CardSetCreateRequest
    | { type: 'CARDSET_CREATE_SUCCESS' }
    | { type: 'CARDSET_CREATE_FAILURE' };

export type CardSetListSuccess = { type: 'CARDSET_LIST_SUCCESS', byId: CardSetsCollection, allIds: IdsArray };
export type CardSetListAction =
    | { type: 'CARDSET_LIST_REQUEST' }
    | CardSetListSuccess
    | { type: 'CARDSET_LIST_FAILURE' }
    | { type: 'CARDSET_LIST_RESET' };

export type CardSetSelectRequest = { type: 'CARDSET_SELECT_REQUEST', id: number };
export type CardSetSelectSuccess = {
    type: 'CARDSET_SELECT_SUCCESS',
    id: number,
    name: string,
    data: Object,
    game_id: number,
};
export type CardSetUpdateData = { type: 'CARDSET_UPDATE_DATA', cardset: CardSetType };
export type CardSetCreateCard = { type: 'CARDSET_CREATE_CARD', card: CardType };
export type CardSetCloneCard = { type: 'CARDSET_CLONE_CARD', card: CardType };
export type CardSetRemoveCard = { type: 'CARDSET_REMOVE_CARD', card: CardType };
export type CardSetUpdateCardCount = { type: 'CARDSET_UPDATE_CARD_COUNT', card: CardType, count: number };
export type CardSetAddTemplateText = { type: 'CARDSET_ADD_TEMPLATE_TEXT' };
export type CardSetUpdateDataSuccess = { type: 'CARDSET_UPDATE_DATA_SUCCESS' };
export type CardSetUpdateDataFailure = { type: 'CARDSET_UPDATE_DATA_FAILURE' };
export type CardSetSelectAction =
    | CardSetSelectRequest
    | CardSetSelectSuccess
    | { type: 'CARDSET_SELECT_FAILURE' }
    | CardSetUpdateData
    | CardSetUpdateDataSuccess
    | CardSetUpdateDataFailure
    | CardSetCreateCard
    | CardSetCloneCard
    | CardSetRemoveCard
    | CardSetUpdateCardCount
    | CardSetAddTemplateText;

export type CardSetAction = CardSetCreateAction | CardSetListAction | CardSetSelectAction;

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

export const gameSelectRequest = (id: number, updateCardSets: boolean): GameAction => {
    return {
        type: 'GAME_SELECT_REQUEST',
        id,
        updateCardSets,
    };
};

export const cardSetCreateRequest = (cardsetname: string, game_id: number): CardSetAction => {
    return {
        type: 'CARDSET_CREATE_REQUEST',
        cardsetname: cardsetname,
        game_id,
    };
};

export const cardSetSelectRequest = (id: number): CardSetSelectRequest => {
    return {
        type: 'CARDSET_SELECT_REQUEST',
        id,
    };
};

export const cardSetUpdateData = (cardset: CardSetType): CardSetUpdateData => {
    return {
        type: 'CARDSET_UPDATE_DATA',
        cardset,
    };
};

export const cardSetCreateCard = (card: CardType): CardSetCreateCard => {
    return {
        type: 'CARDSET_CREATE_CARD',
        card,
    };
};

export const cardSetCloneCard = (card: CardType): CardSetCreateCard => {
    return {
        type: 'CARDSET_CLONE_CARD',
        card,
    };
};

export const cardSetRemoveCard = (card: CardType): CardSetRemoveCard => {
    return {
        type: 'CARDSET_REMOVE_CARD',
        card,
    };
};

export const cardSetUpdateCardCount = (card: CardType, count: number): CardSetUpdateCardCount => {
    return {
        type: 'CARDSET_UPDATE_CARD_COUNT',
        card,
        count,
    };
};

export const cardSetAddTemplateText = (): CardSetAddTemplateText => {
    return {
        type: 'CARDSET_ADD_TEMPLATE_TEXT',
    };
};
