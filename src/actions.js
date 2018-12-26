// @flow

import shortid from 'shortid';

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

export type TextTemplateType = {
    id: string,
    x: number,
    y: number,
    width: number,
    height: number,
    angle: number,
    align: string,
};
export type TextTemplatesCollection = { [string]: TextTemplateType };
export type CardTemplateType = { texts: TextTemplatesCollection, images: any };

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

export type GameSelectRequest = { type: 'GAME_SELECT_REQUEST', id: string, updateCardSets: boolean };
export type GameSelectAction =
    | GameSelectRequest
    | { type: 'GAME_SELECT_SUCCESS', id: string }
    | { type: 'GAME_SELECT_FAILURE' };

export type GameAction = GameCreateAction | GameListAction | GameSelectAction;

export type CardSetCreateRequest = { type: 'CARDSET_CREATE_REQUEST', cardsetname: string, game_id: string };
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

export type CardSetSelectRequest = { type: 'CARDSET_SELECT_REQUEST', id: string };
export type CardSetSelectSuccess = {
    type: 'CARDSET_SELECT_SUCCESS',
    id: string,
    name: string,
    data: {
        cardsAllIds: IdsArray,
        cardsById: { [string]: CardType },
        template: CardTemplateType,
        texts: {
            [string]: {
                [string]: TextInfo,
            },
        },
    },
    game_id: string,
};
export type CardSetCreateCard = { type: 'CARDSET_CREATE_CARD', card: CardType };
export type CardSetCloneCard = { type: 'CARDSET_CLONE_CARD', card: CardType };
export type CardSetRemoveCard = { type: 'CARDSET_REMOVE_CARD', card: CardType };
export type CardSetUpdateCardCount = { type: 'CARDSET_UPDATE_CARD_COUNT', card: CardType, count: number };
export type CardSetAddTextTemplate = { type: 'CARDSET_ADD_TEXT_TEMPLATE' };
export type CardSetChangeTextTemplatePosition = {
    type: 'CARDSET_CHANGE_TEXT_TEMPLATE_POSITION',
    textTemplate: TextTemplateType,
    x: number,
    y: number,
};
export type CardSetChangeTextTemplateSize = {
    type: 'CARDSET_CHANGE_TEXT_TEMPLATE_SIZE',
    textTemplate: TextTemplateType,
    width: number,
    height: number,
};
export type CardSetChangeTextTemplateAngle = {
    type: 'CARDSET_CHANGE_TEXT_TEMPLATE_ANGLE',
    textTemplate: TextTemplateType,
    angle: number,
};
export type CardSetChangeActiveTextTemplateAlign = {
    type: 'CARDSET_CHANGE_ACTIVE_TEXT_TEMPLATE_ALIGN',
    align: string,
};
export type CardSetChangeText = {
    type: 'CARDSET_CHANGE_TEXT',
    cardId: string,
    templateId: string,
    textInfo: TextInfo,
};
export type CardSetSetActiveCardAndTemplate = {
    type: 'CARDSET_SET_ACTIVE_CARD_AND_TEMPLATE',
    cardId: ?string,
    templateId: ?string,
};
export type CardSetUpdateDataSuccess = { type: 'CARDSET_UPDATE_DATA_SUCCESS' };
export type CardSetUpdateDataFailure = { type: 'CARDSET_UPDATE_DATA_FAILURE' };
export type CardSetSelectAction =
    | CardSetSelectRequest
    | CardSetSelectSuccess
    | { type: 'CARDSET_SELECT_FAILURE' }
    | CardSetUpdateDataSuccess
    | CardSetUpdateDataFailure
    | CardSetCreateCard
    | CardSetCloneCard
    | CardSetRemoveCard
    | CardSetUpdateCardCount
    | CardSetAddTextTemplate
    | CardSetChangeTextTemplatePosition
    | CardSetChangeTextTemplateSize
    | CardSetChangeTextTemplateAngle
    | CardSetChangeActiveTextTemplateAlign
    | CardSetChangeText
    | CardSetSetActiveCardAndTemplate;

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

export const gameSelectRequest = (id: string, updateCardSets: boolean): GameAction => {
    return {
        type: 'GAME_SELECT_REQUEST',
        id,
        updateCardSets,
    };
};

export const cardSetCreateRequest = (cardsetname: string, game_id: string): CardSetAction => {
    return {
        type: 'CARDSET_CREATE_REQUEST',
        cardsetname: cardsetname,
        game_id,
    };
};

export const cardSetSelectRequest = (id: string): CardSetSelectRequest => {
    return {
        type: 'CARDSET_SELECT_REQUEST',
        id,
    };
};

export const cardSetCreateCard = (card: CardType): CardSetCreateCard => {
    return {
        type: 'CARDSET_CREATE_CARD',
        card,
    };
};

export const cardSetCloneCard = (card: CardType): CardSetCloneCard => {
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

export const cardSetAddTextTemplate = (): CardSetAddTextTemplate => {
    return {
        type: 'CARDSET_ADD_TEXT_TEMPLATE',
    };
};

export const cardSetChangeTextTemplatePosition = (
    textTemplate: TextTemplateType,
    x: number,
    y: number,
): CardSetChangeTextTemplatePosition => {
    return {
        type: 'CARDSET_CHANGE_TEXT_TEMPLATE_POSITION',
        textTemplate,
        x,
        y,
    };
};

export const cardSetChangeTextTemplateSize = (
    textTemplate: TextTemplateType,
    width: number,
    height: number,
): CardSetChangeTextTemplateSize => {
    return {
        type: 'CARDSET_CHANGE_TEXT_TEMPLATE_SIZE',
        textTemplate,
        width,
        height,
    };
};

export const cardSetChangeTextTemplateAngle = (
    textTemplate: TextTemplateType,
    angle: number,
): CardSetChangeTextTemplateAngle => {
    return {
        type: 'CARDSET_CHANGE_TEXT_TEMPLATE_ANGLE',
        textTemplate,
        angle,
    };
};

export const cardSetChangeActiveTextTemplateAlign = (align: string): CardSetChangeActiveTextTemplateAlign => {
    return {
        type: 'CARDSET_CHANGE_ACTIVE_TEXT_TEMPLATE_ALIGN',
        align,
    };
};

export const cardSetChangeText = (cardId: string, templateId: string, textInfo: TextInfo): CardSetChangeText => {
    return {
        type: 'CARDSET_CHANGE_TEXT',
        cardId,
        templateId,
        textInfo,
    };
};

export const cardSetActiveCardAndTemplate = (cardId: ?string, templateId: ?string): CardSetSetActiveCardAndTemplate => {
    return {
        type: 'CARDSET_SET_ACTIVE_CARD_AND_TEMPLATE',
        cardId,
        templateId,
    };
};
