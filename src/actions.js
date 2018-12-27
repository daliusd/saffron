// @flow

import shortid from 'shortid';

export const INIT_REQUEST: 'INIT_REQUEST' = 'INIT_REQUEST';
export const MESSAGE_DISPLAY: 'MESSAGE_DISPLAY' = 'MESSAGE_DISPLAY';
export const MESSAGE_HIDE: 'MESSAGE_HIDE' = 'MESSAGE_HIDE';
export const LOGIN_REQUEST: 'LOGIN_REQUEST' = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS: 'LOGIN_SUCCESS' = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE: 'LOGIN_FAILURE' = 'LOGIN_FAILURE';
export const LOGOUT_REQUEST: 'LOGOUT_REQUEST' = 'LOGOUT_REQUEST';
export const LOGOUT_FAILURE: 'LOGOUT_FAILURE' = 'LOGOUT_FAILURE';
export const LOGOUT_SUCCESS: 'LOGOUT_SUCCESS' = 'LOGOUT_SUCCESS';
export const SIGNUP_REQUEST: 'SIGNUP_REQUEST' = 'SIGNUP_REQUEST';
export const SIGNUP_SUCCESS: 'SIGNUP_SUCCESS' = 'SIGNUP_SUCCESS';
export const SIGNUP_FAILURE: 'SIGNUP_FAILURE' = 'SIGNUP_FAILURE';
export const GAME_CREATE_REQUEST: 'GAME_CREATE_REQUEST' = 'GAME_CREATE_REQUEST';
export const GAME_CREATE_SUCCESS: 'GAME_CREATE_SUCCESS' = 'GAME_CREATE_SUCCESS';
export const GAME_CREATE_FAILURE: 'GAME_CREATE_FAILURE' = 'GAME_CREATE_FAILURE';
export const GAME_LIST_SUCCESS: 'GAME_LIST_SUCCESS' = 'GAME_LIST_SUCCESS';
export const GAME_LIST_REQUEST: 'GAME_LIST_REQUEST' = 'GAME_LIST_REQUEST';
export const GAME_LIST_FAILURE: 'GAME_LIST_FAILURE' = 'GAME_LIST_FAILURE';
export const GAME_LIST_RESET: 'GAME_LIST_RESET' = 'GAME_LIST_RESET';
export const GAME_SELECT_REQUEST: 'GAME_SELECT_REQUEST' = 'GAME_SELECT_REQUEST';
export const GAME_SELECT_SUCCESS: 'GAME_SELECT_SUCCESS' = 'GAME_SELECT_SUCCESS';
export const GAME_SELECT_FAILURE: 'GAME_SELECT_FAILURE' = 'GAME_SELECT_FAILURE';
export const CARDSET_CREATE_REQUEST: 'CARDSET_CREATE_REQUEST' = 'CARDSET_CREATE_REQUEST';
export const CARDSET_CREATE_SUCCESS: 'CARDSET_CREATE_SUCCESS' = 'CARDSET_CREATE_SUCCESS';
export const CARDSET_CREATE_FAILURE: 'CARDSET_CREATE_FAILURE' = 'CARDSET_CREATE_FAILURE';
export const CARDSET_LIST_SUCCESS: 'CARDSET_LIST_SUCCESS' = 'CARDSET_LIST_SUCCESS';
export const CARDSET_LIST_REQUEST: 'CARDSET_LIST_REQUEST' = 'CARDSET_LIST_REQUEST';
export const CARDSET_LIST_FAILURE: 'CARDSET_LIST_FAILURE' = 'CARDSET_LIST_FAILURE';
export const CARDSET_LIST_RESET: 'CARDSET_LIST_RESET' = 'CARDSET_LIST_RESET';
export const CARDSET_SELECT_REQUEST: 'CARDSET_SELECT_REQUEST' = 'CARDSET_SELECT_REQUEST';
export const CARDSET_SELECT_SUCCESS: 'CARDSET_SELECT_SUCCESS' = 'CARDSET_SELECT_SUCCESS';
export const CARDSET_CREATE_CARD: 'CARDSET_CREATE_CARD' = 'CARDSET_CREATE_CARD';
export const CARDSET_CLONE_CARD: 'CARDSET_CLONE_CARD' = 'CARDSET_CLONE_CARD';
export const CARDSET_REMOVE_CARD: 'CARDSET_REMOVE_CARD' = 'CARDSET_REMOVE_CARD';
export const CARDSET_UPDATE_CARD_COUNT: 'CARDSET_UPDATE_CARD_COUNT' = 'CARDSET_UPDATE_CARD_COUNT';
export const CARDSET_ADD_TEXT_PLACEHOLDER: 'CARDSET_ADD_TEXT_PLACEHOLDER' = 'CARDSET_ADD_TEXT_PLACEHOLDER';
export const CARDSET_CHANGE_TEXT_PLACEHOLDER_POSITION: 'CARDSET_CHANGE_TEXT_PLACEHOLDER_POSITION' =
    'CARDSET_CHANGE_TEXT_PLACEHOLDER_POSITION';
export const CARDSET_CHANGE_TEXT_PLACEHOLDER_SIZE: 'CARDSET_CHANGE_TEXT_PLACEHOLDER_SIZE' =
    'CARDSET_CHANGE_TEXT_PLACEHOLDER_SIZE';
export const CARDSET_CHANGE_TEXT_PLACEHOLDER_ANGLE: 'CARDSET_CHANGE_TEXT_PLACEHOLDER_ANGLE' =
    'CARDSET_CHANGE_TEXT_PLACEHOLDER_ANGLE';
export const CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_ALIGN: 'CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_ALIGN' =
    'CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_ALIGN';
export const CARDSET_CHANGE_TEXT: 'CARDSET_CHANGE_TEXT' = 'CARDSET_CHANGE_TEXT';
export const CARDSET_SET_ACTIVE_CARD_AND_PLACEHOLDER: 'CARDSET_SET_ACTIVE_CARD_AND_PLACEHOLDER' =
    'CARDSET_SET_ACTIVE_CARD_AND_PLACEHOLDER';
export const CARDSET_UPDATE_DATA_SUCCESS: 'CARDSET_UPDATE_DATA_SUCCESS' = 'CARDSET_UPDATE_DATA_SUCCESS';
export const CARDSET_UPDATE_DATA_FAILURE: 'CARDSET_UPDATE_DATA_FAILURE' = 'CARDSET_UPDATE_DATA_FAILURE';
export const CARDSET_SELECT_FAILURE: 'CARDSET_SELECT_FAILURE' = 'CARDSET_SELECT_FAILURE';

export type IdsArray = Array<string>;

export type MessageType = {
    id: string,
    type: string,
    text: string,
};

export type GameType = {
    id: string,
    name: string,
};

export type GamesCollection = {
    [string]: GameType,
};

export type TextPlaceholderType = {
    id: string,
    type: 'text',
    x: number,
    y: number,
    width: number,
    height: number,
    angle: number,
    align: string,
};
export type TemplateType = { [string]: TextPlaceholderType };

export type TextInfo = { value: string, cursor: number };
export type CardType = { id: string, count: number };

export type CardSetType = {
    id: string,
    name: string,
};

export type CardSetsCollection = {
    [string]: CardSetType,
};

export type Credentials = { username: string, password: string };

export type InitAction = { type: typeof INIT_REQUEST };

export type MessageAction =
    | { type: typeof MESSAGE_DISPLAY, message: MessageType }
    | { type: typeof MESSAGE_HIDE, message: MessageType };

export type LoginRequest = { type: typeof LOGIN_REQUEST, creds: Credentials };
export type LoginAction =
    | LoginRequest
    | { type: typeof LOGIN_SUCCESS }
    | { type: typeof LOGIN_FAILURE, message: string }
    | { type: typeof LOGOUT_REQUEST }
    | { type: typeof LOGOUT_FAILURE }
    | { type: typeof LOGOUT_SUCCESS };

export type SignUpRequest = { type: typeof SIGNUP_REQUEST, creds: Credentials };
export type SignUpAction = SignUpRequest | { type: typeof SIGNUP_SUCCESS } | { type: typeof SIGNUP_FAILURE };

export type GameCreateRequest = { type: typeof GAME_CREATE_REQUEST, gamename: string };
export type GameCreateAction =
    | GameCreateRequest
    | { type: typeof GAME_CREATE_SUCCESS }
    | { type: typeof GAME_CREATE_FAILURE };

export type GameListSuccess = { type: typeof GAME_LIST_SUCCESS, byId: GamesCollection, allIds: IdsArray };
export type GameListAction =
    | { type: typeof GAME_LIST_REQUEST }
    | GameListSuccess
    | { type: typeof GAME_LIST_FAILURE }
    | { type: typeof GAME_LIST_RESET };

export type GameSelectRequest = { type: typeof GAME_SELECT_REQUEST, id: string, updateCardSets: boolean };
export type GameSelectAction =
    | GameSelectRequest
    | { type: typeof GAME_SELECT_SUCCESS, id: string }
    | { type: typeof GAME_SELECT_FAILURE };

export type GameAction = GameCreateAction | GameListAction | GameSelectAction;

export type CardSetCreateRequest = { type: typeof CARDSET_CREATE_REQUEST, cardsetname: string, game_id: string };
export type CardSetCreateAction =
    | CardSetCreateRequest
    | { type: typeof CARDSET_CREATE_SUCCESS }
    | { type: typeof CARDSET_CREATE_FAILURE };

export type CardSetListSuccess = { type: typeof CARDSET_LIST_SUCCESS, byId: CardSetsCollection, allIds: IdsArray };
export type CardSetListAction =
    | { type: typeof CARDSET_LIST_REQUEST }
    | CardSetListSuccess
    | { type: typeof CARDSET_LIST_FAILURE }
    | { type: typeof CARDSET_LIST_RESET };

export type CardSetSelectRequest = { type: typeof CARDSET_SELECT_REQUEST, id: string };
export type CardSetSelectSuccess = {
    type: typeof CARDSET_SELECT_SUCCESS,
    id: string,
    name: string,
    data: {
        cardsAllIds: IdsArray,
        cardsById: { [string]: CardType },
        template: TemplateType,
        texts: {
            [string]: {
                [string]: TextInfo,
            },
        },
    },
    game_id: string,
};
export type CardSetCreateCard = { type: typeof CARDSET_CREATE_CARD, card: CardType };
export type CardSetCloneCard = { type: typeof CARDSET_CLONE_CARD, card: CardType };
export type CardSetRemoveCard = { type: typeof CARDSET_REMOVE_CARD, card: CardType };
export type CardSetUpdateCardCount = { type: typeof CARDSET_UPDATE_CARD_COUNT, card: CardType, count: number };
export type CardSetAddTextPlaceholder = { type: typeof CARDSET_ADD_TEXT_PLACEHOLDER };
export type CardSetChangeTextPlaceholderPosition = {
    type: typeof CARDSET_CHANGE_TEXT_PLACEHOLDER_POSITION,
    textPlaceholder: TextPlaceholderType,
    x: number,
    y: number,
};
export type CardSetChangeTextPlaceholderSize = {
    type: typeof CARDSET_CHANGE_TEXT_PLACEHOLDER_SIZE,
    textPlaceholder: TextPlaceholderType,
    width: number,
    height: number,
};
export type CardSetChangeTextPlaceholderAngle = {
    type: typeof CARDSET_CHANGE_TEXT_PLACEHOLDER_ANGLE,
    textPlaceholder: TextPlaceholderType,
    angle: number,
};
export type CardSetChangeActiveTextPlaceholderAlign = {
    type: typeof CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_ALIGN,
    align: string,
};
export type CardSetChangeText = {
    type: typeof CARDSET_CHANGE_TEXT,
    cardId: string,
    placeholderId: string,
    textInfo: TextInfo,
};
export type CardSetSetActiveCardAndPlaceholder = {
    type: typeof CARDSET_SET_ACTIVE_CARD_AND_PLACEHOLDER,
    cardId: ?string,
    placeholderId: ?string,
};
export type CardSetUpdateDataSuccess = { type: typeof CARDSET_UPDATE_DATA_SUCCESS };
export type CardSetUpdateDataFailure = { type: typeof CARDSET_UPDATE_DATA_FAILURE };
export type CardSetSelectAction =
    | CardSetSelectRequest
    | CardSetSelectSuccess
    | { type: typeof CARDSET_SELECT_FAILURE }
    | CardSetUpdateDataSuccess
    | CardSetUpdateDataFailure
    | CardSetCreateCard
    | CardSetCloneCard
    | CardSetRemoveCard
    | CardSetUpdateCardCount
    | CardSetAddTextPlaceholder
    | CardSetChangeTextPlaceholderPosition
    | CardSetChangeTextPlaceholderSize
    | CardSetChangeTextPlaceholderAngle
    | CardSetChangeActiveTextPlaceholderAlign
    | CardSetChangeText
    | CardSetSetActiveCardAndPlaceholder;

export type CardSetAction = CardSetCreateAction | CardSetListAction | CardSetSelectAction;

export type Action = InitAction | LoginAction | SignUpAction | GameAction | CardSetAction | MessageAction;

export type Dispatch = (action: Action) => any;

export const messageRequest = (type: string, text: string): MessageAction => {
    return {
        type: MESSAGE_DISPLAY,
        message: {
            id: shortid.generate(),
            type: type,
            text: text,
        },
    };
};

export const initRequest = (): InitAction => {
    return { type: INIT_REQUEST };
};

export const loginRequest = (creds: Credentials): LoginAction => {
    return {
        type: LOGIN_REQUEST,
        creds: creds,
    };
};

export const logoutRequest = (): LoginAction => {
    return {
        type: LOGOUT_REQUEST,
    };
};

export const signupRequest = (creds: Credentials): SignUpAction => {
    return {
        type: SIGNUP_REQUEST,
        creds: creds,
    };
};

export const gameCreateRequest = (gamename: string): GameAction => {
    return {
        type: GAME_CREATE_REQUEST,
        gamename: gamename,
    };
};

export const gameListRequest = (): GameAction => {
    return {
        type: GAME_LIST_REQUEST,
    };
};

export const gameSelectRequest = (id: string, updateCardSets: boolean): GameAction => {
    return {
        type: GAME_SELECT_REQUEST,
        id,
        updateCardSets,
    };
};

export const cardSetCreateRequest = (cardsetname: string, game_id: string): CardSetAction => {
    return {
        type: CARDSET_CREATE_REQUEST,
        cardsetname: cardsetname,
        game_id,
    };
};

export const cardSetSelectRequest = (id: string): CardSetSelectRequest => {
    return {
        type: CARDSET_SELECT_REQUEST,
        id,
    };
};

export const cardSetCreateCard = (card: CardType): CardSetCreateCard => {
    return {
        type: CARDSET_CREATE_CARD,
        card,
    };
};

export const cardSetCloneCard = (card: CardType): CardSetCloneCard => {
    return {
        type: CARDSET_CLONE_CARD,
        card,
    };
};

export const cardSetRemoveCard = (card: CardType): CardSetRemoveCard => {
    return {
        type: CARDSET_REMOVE_CARD,
        card,
    };
};

export const cardSetUpdateCardCount = (card: CardType, count: number): CardSetUpdateCardCount => {
    return {
        type: CARDSET_UPDATE_CARD_COUNT,
        card,
        count,
    };
};

export const cardSetAddTextPlaceholder = (): CardSetAddTextPlaceholder => {
    return {
        type: CARDSET_ADD_TEXT_PLACEHOLDER,
    };
};

export const cardSetChangeTextPlaceholderPosition = (
    textPlaceholder: TextPlaceholderType,
    x: number,
    y: number,
): CardSetChangeTextPlaceholderPosition => {
    return {
        type: CARDSET_CHANGE_TEXT_PLACEHOLDER_POSITION,
        textPlaceholder,
        x,
        y,
    };
};

export const cardSetChangeTextPlaceholderSize = (
    textPlaceholder: TextPlaceholderType,
    width: number,
    height: number,
): CardSetChangeTextPlaceholderSize => {
    return {
        type: CARDSET_CHANGE_TEXT_PLACEHOLDER_SIZE,
        textPlaceholder,
        width,
        height,
    };
};

export const cardSetChangeTextPlaceholderAngle = (
    textPlaceholder: TextPlaceholderType,
    angle: number,
): CardSetChangeTextPlaceholderAngle => {
    return {
        type: CARDSET_CHANGE_TEXT_PLACEHOLDER_ANGLE,
        textPlaceholder,
        angle,
    };
};

export const cardSetChangeActiveTextPlaceholderAlign = (align: string): CardSetChangeActiveTextPlaceholderAlign => {
    return {
        type: CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_ALIGN,
        align,
    };
};

export const cardSetChangeText = (cardId: string, placeholderId: string, textInfo: TextInfo): CardSetChangeText => {
    return {
        type: CARDSET_CHANGE_TEXT,
        cardId,
        placeholderId,
        textInfo,
    };
};

export const cardSetActiveCardAndPlaceholder = (
    cardId: ?string,
    placeholderId: ?string,
): CardSetSetActiveCardAndPlaceholder => {
    return {
        type: CARDSET_SET_ACTIVE_CARD_AND_PLACEHOLDER,
        cardId,
        placeholderId,
    };
};
