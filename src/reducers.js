// @flow
import { combineReducers } from 'redux';
import shortid from 'shortid';

import type {
    CardSetAction,
    CardSetsCollection,
    TemplateType,
    CardType,
    GameAction,
    GamesCollection,
    IdsArray,
    LoginAction,
    MessageAction,
    MessageType,
    SignUpAction,
    TextInfo,
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
    +active: ?string,
};

export type CardSetState = {
    +byId: CardSetsCollection,
    +allIds: IdsArray,
    +activity: number,
    +active: ?string,
    +cardsAllIds: IdsArray,
    +cardsById: { [string]: CardType },
    +activeCard: ?string,
    +activePlaceholder: ?string,
    +template: TemplateType,
    +texts: { [string]: { [string]: TextInfo } },
};

export const DefaultCardSetState = {
    byId: {},
    allIds: [],
    activity: 0,
    active: null,
    template: {},
    cardsById: {},
    cardsAllIds: [],
    activeCard: null,
    activePlaceholder: null,
    texts: {},
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
        case 'GAME_LIST_RESET':
            return Object.assign({}, state, {
                activity: 0,
                byId: {},
                allIds: [],
            });
        case 'GAME_SELECT_REQUEST':
            return Object.assign({}, state, {
                activity: ACTIVITY_SELECTING,
            });
        case 'GAME_SELECT_SUCCESS':
            return Object.assign({}, state, {
                activity: state.activity & ~ACTIVITY_SELECTING,
                active: action.id,
            });
        case 'GAME_SELECT_FAILURE':
            return Object.assign({}, state, {
                activity: state.activity & ~ACTIVITY_SELECTING,
            });
        default:
            return state;
    }
}

export function cardsets(state: CardSetState = DefaultCardSetState, action: CardSetAction): CardSetState {
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
                byId: action.byId,
                allIds: action.allIds,
            });
        case 'CARDSET_LIST_RESET':
            return Object.assign({}, state, {
                activity: 0,
                byId: {},
                allIds: [],
            });
        case 'CARDSET_LIST_FAILURE':
            return Object.assign({}, state, {
                activity: state.activity & ~ACTIVITY_LISTING,
            });
        case 'CARDSET_SELECT_REQUEST':
            return Object.assign({}, state, {
                activity: state.activity | ACTIVITY_SELECTING,
            });
        case 'CARDSET_SELECT_SUCCESS':
            return Object.assign({}, state, {
                activity: state.activity & ~ACTIVITY_SELECTING,
                active: action.id,
                byId: Object.assign({}, state.byId, {
                    [action.id]: {
                        id: action.id,
                        name: action.name,
                    },
                }),
                cardsAllIds: action.data.cardsAllIds,
                cardsById: action.data.cardsById,
                template: action.data.template,
                texts: action.data.texts,
            });
        case 'CARDSET_SELECT_FAILURE':
            return Object.assign({}, state, {
                activity: state.activity & ~ACTIVITY_SELECTING,
            });
        case 'CARDSET_CREATE_CARD':
            return {
                ...state,
                cardsById: {
                    ...state.cardsById,
                    [action.card.id]: action.card,
                },
                cardsAllIds: state.cardsAllIds ? state.cardsAllIds.concat(action.card.id) : [action.card.id],
            };
        case 'CARDSET_CLONE_CARD': {
            let newCard = { ...action.card, id: shortid.generate() };

            const index = state.cardsAllIds.indexOf(action.card.id) + 1;
            const cardsAllIds = [...state.cardsAllIds.slice(0, index), newCard.id, ...state.cardsAllIds.slice(index)];

            return {
                ...state,
                cardsById: {
                    ...state.cardsById,
                    [newCard.id]: newCard,
                },
                cardsAllIds,
            };
        }
        case 'CARDSET_REMOVE_CARD': {
            const card_id = action.card.id;
            let cardsById = { ...state.cardsById };
            delete cardsById[card_id];

            const cardsAllIds = state.cardsAllIds.filter(id => id !== card_id);

            return {
                ...state,
                cardsById,
                cardsAllIds,
            };
        }
        case 'CARDSET_UPDATE_CARD_COUNT': {
            const cardId = action.card.id;
            let card = { ...state.cardsById[cardId] };
            card.count = action.count;

            return {
                ...state,
                cardsById: {
                    ...state.cardsById,
                    [cardId]: card,
                },
            };
        }
        case 'CARDSET_ADD_TEXT_PLACEHOLDER': {
            const id = shortid.generate();
            const textPlaceholder = { id, x: 10, y: 10, width: 50, height: 50, angle: 0 };

            return {
                ...state,
                template: {
                    ...state.template,
                    [id]: textPlaceholder,
                },
            };
        }
        case 'CARDSET_CHANGE_TEXT_PLACEHOLDER_POSITION': {
            const textPlaceholder = {
                ...state.template[action.textPlaceholder.id],
                x: action.x,
                y: action.y,
            };

            return {
                ...state,
                template: {
                    ...state.template,
                    [action.textPlaceholder.id]: textPlaceholder,
                },
            };
        }
        case 'CARDSET_CHANGE_TEXT_PLACEHOLDER_SIZE': {
            const textPlaceholder = {
                ...state.template[action.textPlaceholder.id],
                width: action.width,
                height: action.height,
            };

            return {
                ...state,
                template: {
                    ...state.template,
                    [action.textPlaceholder.id]: textPlaceholder,
                },
            };
        }
        case 'CARDSET_CHANGE_TEXT_PLACEHOLDER_ANGLE': {
            const textPlaceholder = {
                ...state.template[action.textPlaceholder.id],
                angle: action.angle,
            };

            return {
                ...state,
                template: {
                    ...state.template,
                    [action.textPlaceholder.id]: textPlaceholder,
                },
            };
        }
        case 'CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_ALIGN': {
            if (state.activePlaceholder) {
                const textPlaceholder = {
                    ...state.template[state.activePlaceholder],
                    align: action.align,
                };

                return {
                    ...state,
                    template: {
                        ...state.template,
                        [state.activePlaceholder]: textPlaceholder,
                    },
                };
            } else {
                return state;
            }
        }
        case 'CARDSET_CHANGE_TEXT': {
            let placeholdersByCard = {};
            if (state.texts && action.cardId in state.texts) {
                placeholdersByCard = { ...state.texts[action.cardId] };
            }
            placeholdersByCard[action.placeholderId] = action.textInfo;

            return {
                ...state,
                texts: {
                    ...state.texts,
                    [action.cardId]: placeholdersByCard,
                },
            };
        }
        case 'CARDSET_SET_ACTIVE_CARD_AND_PLACEHOLDER': {
            return {
                ...state,
                activeCard: action.cardId,
                activePlaceholder: action.placeholderId,
            };
        }
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
