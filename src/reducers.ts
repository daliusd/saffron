import { combineReducers } from 'redux';
import shortid from 'shortid';
import undoable from 'redux-undo';

import {
    CARDSET_ADD_IMAGE_FIELD,
    CARDSET_ADD_TEXT_FIELD,
    CARDSET_CHANGE_ACTIVE_FIELD_NAME,
    CARDSET_CHANGE_ACTIVE_TEXT_FIELD_ALIGN,
    CARDSET_CHANGE_ACTIVE_TEXT_FIELD_COLOR,
    CARDSET_CHANGE_ACTIVE_TEXT_FIELD_FONT_FAMILY,
    CARDSET_CHANGE_ACTIVE_TEXT_FIELD_FONT_FAMILY_AND_VARIANT,
    CARDSET_CHANGE_ACTIVE_TEXT_FIELD_FONT_SIZE,
    CARDSET_CHANGE_ACTIVE_TEXT_FIELD_FONT_VARIANT,
    CARDSET_CHANGE_ACTIVE_TEXT_FIELD_LINE_HEIGHT,
    CARDSET_CHANGE_FIT_FOR_ACTIVE_FIELD,
    CARDSET_CHANGE_CROP_FOR_ACTIVE_FIELD,
    CARDSET_CHANGE_HEIGHT,
    CARDSET_CHANGE_IMAGE,
    CARDSET_CHANGE_IMAGE_BASE64,
    CARDSET_CHANGE_IS_TWO_SIDED,
    CARDSET_CHANGE_FIELD_ANGLE,
    CARDSET_CHANGE_FIELD_SIZE,
    CARDSET_CHANGE_SNAPPING_DISTANCE,
    CARDSET_CHANGE_TEXT,
    CARDSET_CHANGE_WIDTH,
    CARDSET_CLONE_CARD,
    CARDSET_CREATE_CARD,
    CARDSET_IMPORT_DATA,
    CARDSET_LIST_RESET,
    CARDSET_LIST_SUCCESS,
    CARDSET_LOCK_ACTIVE_FIELD,
    CARDSET_LOWER_ACTIVE_FIELD_TO_BOTTOM,
    CARDSET_RAISE_ACTIVE_FIELD_TO_TOP,
    CARDSET_REMOVE_ACTIVE_FIELD,
    CARDSET_REMOVE_CARD,
    CARDSET_RENAME_REQUEST,
    CARDSET_SELECT_FAILURE,
    CARDSET_SELECT_REQUEST,
    CARDSET_SELECT_SUCCESS,
    CARDSET_SET_ACTIVE_CARD_AND_FIELD,
    CARDSET_SET_SIDEBAR_STATE,
    CARDSET_SET_ZOOM,
    CARDSET_UNLOCK_ACTIVE_FIELD,
    CARDSET_UPDATE_CARD_COUNT,
    CardSetAction,
    GAME_CREATE_PDF_FAILURE,
    GAME_CREATE_PDF_REQUEST,
    GAME_CREATE_PDF_SUCCESS,
    GAME_CREATE_PNG_FAILURE,
    GAME_CREATE_PNG_REQUEST,
    GAME_CREATE_PNG_SUCCESS,
    GAME_LIST_RESET,
    GAME_LIST_SUCCESS,
    GAME_RENAME_REQUEST,
    GAME_SELECT_FAILURE,
    GAME_SELECT_REQUEST,
    GAME_SELECT_SUCCESS,
    GameAction,
    IMAGE_LIST_REQUEST,
    IMAGE_LIST_SUCCESS,
    ImageListAction,
    LOGIN_FAILURE,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGOUT_SUCCESS,
    LoginAction,
    MESSAGE_DISPLAY,
    MESSAGE_HIDE,
    MessageAction,
    SIGNUP_FAILURE,
    SIGNUP_REQUEST,
    SIGNUP_SUCCESS,
    SidebarState,
    SignUpAction,
    CARDSET_CHANGE_FIELD_ZOOM,
    CARDSET_CHANGE_FIELD_PAN,
    CardSetsAction,
    CARDSETS_SELECT_SUCCESS,
    CARDSET_CHANGE_FIELD_POSITION,
    CARDSET_UNDO,
    CARDSET_REDO,
    Action,
    CARDSET_CHANGE_UNCLICKABLE_FOR_ACTIVE_FIELD,
    CARDSET_CHANGE_APPLY_TO_ALLCARDS,
    CARDSET_RAISE_ACTIVE_FIELD,
    CARDSET_LOWER_ACTIVE_FIELD,
} from './actions';
import {
    CURRENT_CARDSET_VERSION,
    DEFAULT_FONT,
    DEFAULT_FONT_SIZE,
    DEFAULT_FONT_VARIANT,
    DEFAULT_LINE_HEIGHT,
    BLEED_WIDTH,
} from './constants';
import {
    CardSetsCollection,
    CardsCollection,
    GamesCollection,
    IdsArray,
    ImageArray,
    MessageType,
    FieldInfoByCardCollection,
    FieldInfoCollection,
} from './types';
import { rotateVec } from './utils';

export const ACTIVITY_SELECTING = 0x1;
export const ACTIVITY_CREATING_PDF = 0x2;
export const ACTIVITY_CREATING_PNG = 0x4;

export interface MessageState {
    messages: MessageType[];
}

export const DefaultMessageState: MessageState = {
    messages: [],
};

export interface AuthState {
    isAuthenticated?: boolean;
    user: string;
}

export const DefaultAuthState: AuthState = {
    isAuthenticated: undefined,
    user: '', // XXX: user can manipulate this information by changing local storage. Do not trust this info.
};

export interface SignUpState {
    signingup: boolean;
}

export const DefaultSignUpState: SignUpState = {
    signingup: false,
};

export interface GameState {
    byId: GamesCollection;
    allIds: IdsArray;
    activity: number;
    active: string | null;
}

export const DefaultGameState: GameState = {
    byId: {},
    allIds: [],
    activity: 0,
    active: null,
};

export interface TextSettings {
    align: string;
    color: string;
    fontFamily: string;
    fontVariant: string;
    fontSize: number;
    lineHeight?: number;
}

export interface CardSetsState {
    byId: CardSetsCollection;
    allIds: IdsArray;
    active: string | null;
}

export const DefaultCardSetsState: CardSetsState = {
    byId: {},
    allIds: [],
    active: null,
};

export interface CardSetState {
    width: number;
    height: number;
    isTwoSided: boolean;
    snappingDistance: number;
    version: number;
    activity: number;
    cardsAllIds: IdsArray;
    cardsById: CardsCollection;
    activeCardId?: string;
    isBackActive: boolean;
    activeFieldId?: string;
    fieldsAllIds: IdsArray;
    fields: FieldInfoByCardCollection;
    textSettings: TextSettings;
    activeSidebar: SidebarState | null;
    zoom: number;
    applyToAllCards: boolean;
}

export const DefaultCardSetState: CardSetState = {
    width: 63.5,
    height: 88.9,
    isTwoSided: false,
    snappingDistance: 1,
    version: CURRENT_CARDSET_VERSION,
    activity: 0,
    cardsById: {},
    cardsAllIds: [],
    activeCardId: undefined,
    isBackActive: false,
    activeFieldId: undefined,
    fieldsAllIds: [],
    fields: {},
    textSettings: {
        align: 'left',
        color: '#000000',
        fontFamily: DEFAULT_FONT,
        fontVariant: DEFAULT_FONT_VARIANT,
        fontSize: DEFAULT_FONT_SIZE,
        lineHeight: DEFAULT_LINE_HEIGHT,
    },
    activeSidebar: null,
    zoom: 1,
    applyToAllCards: false,
};

export interface ImageState {
    activity: number;
    filter: string;
    images: ImageArray;
}

export const DefaultImageState: ImageState = {
    activity: 0,
    filter: '',
    images: [],
};

export interface State {
    message: MessageState;
    auth: AuthState;
    signup: SignUpState;
    games: GameState;
    cardsets: CardSetsState;
    cardset: {
        present: CardSetState;
    };
    images: ImageState;
}

export const DefaultState: State = {
    message: DefaultMessageState,
    auth: DefaultAuthState,
    signup: DefaultSignUpState,
    games: DefaultGameState,
    cardsets: DefaultCardSetsState,
    cardset: {
        present: DefaultCardSetState,
    },
    images: DefaultImageState,
};

export function message(state: MessageState = DefaultMessageState, action: MessageAction): MessageState {
    switch (action.type) {
        case MESSAGE_DISPLAY:
            const found = state.messages.find(m => m.id === action.message.id);
            if (found) return state;

            return {
                ...state,
                messages: state.messages.concat(action.message),
            };
        case MESSAGE_HIDE:
            return Object.assign({}, state, {
                messages: state.messages.filter(m => m.id !== action.messageId),
            });
        default:
            return state;
    }
}

export function auth(state: AuthState = DefaultAuthState, action: LoginAction): AuthState {
    switch (action.type) {
        case LOGIN_REQUEST:
            return Object.assign({}, state, {
                isAuthenticated: undefined,
                user: '',
            });
        case LOGIN_SUCCESS:
            return Object.assign({}, state, {
                isAuthenticated: true,
                user: action.username,
            });
        case LOGIN_FAILURE:
            return Object.assign({}, state, {
                isAuthenticated: false,
            });
        case LOGOUT_SUCCESS:
            return Object.assign({}, state, {
                isAuthenticated: false,
                user: '',
            });
        default:
            return state;
    }
}

export function signup(state: SignUpState = DefaultSignUpState, action: SignUpAction): SignUpState {
    switch (action.type) {
        case SIGNUP_REQUEST:
            return Object.assign({}, state, {
                signingup: true,
            });
        case SIGNUP_SUCCESS:
            return Object.assign({}, state, {
                signingup: false,
            });
        case SIGNUP_FAILURE:
            return Object.assign({}, state, {
                signingup: false,
            });
        default:
            return state;
    }
}

export function games(state: GameState = DefaultGameState, action: GameAction): GameState {
    switch (action.type) {
        case GAME_RENAME_REQUEST:
            const game = state.byId[action.gameId];

            return {
                ...state,
                byId: {
                    ...state.byId,
                    [game.id]: {
                        ...game,
                        name: action.newName,
                    },
                },
            };
        case GAME_LIST_SUCCESS:
            return Object.assign({}, state, {
                byId: action.byId,
                allIds: action.allIds,
            });
        case GAME_LIST_RESET:
            return Object.assign({}, state, {
                activity: 0,
                byId: {},
                allIds: [],
            });
        case GAME_SELECT_REQUEST:
            return Object.assign({}, state, {
                activity: ACTIVITY_SELECTING,
            });
        case GAME_SELECT_SUCCESS:
            return Object.assign({}, state, {
                activity: state.activity & ~ACTIVITY_SELECTING,
                active: action.id,
            });
        case GAME_SELECT_FAILURE:
            return Object.assign({}, state, {
                activity: state.activity & ~ACTIVITY_SELECTING,
            });
        case GAME_CREATE_PDF_REQUEST:
            return Object.assign({}, state, {
                activity: state.activity | ACTIVITY_CREATING_PDF,
            });
        case GAME_CREATE_PDF_SUCCESS:
            return Object.assign({}, state, {
                activity: state.activity & ~ACTIVITY_CREATING_PDF,
            });
        case GAME_CREATE_PDF_FAILURE:
            return Object.assign({}, state, {
                activity: state.activity & ~ACTIVITY_CREATING_PDF,
            });
        case GAME_CREATE_PNG_REQUEST:
            return Object.assign({}, state, {
                activity: state.activity | ACTIVITY_CREATING_PNG,
            });
        case GAME_CREATE_PNG_SUCCESS:
            return Object.assign({}, state, {
                activity: state.activity & ~ACTIVITY_CREATING_PNG,
            });
        case GAME_CREATE_PNG_FAILURE:
            return Object.assign({}, state, {
                activity: state.activity & ~ACTIVITY_CREATING_PNG,
            });
        default:
            return state;
    }
}

export function cardsets(state: CardSetsState = DefaultCardSetsState, action: CardSetsAction): CardSetsState {
    switch (action.type) {
        case CARDSETS_SELECT_SUCCESS:
            return {
                ...state,
                active: action.id,
                byId: Object.assign({}, state.byId, {
                    [action.id]: {
                        id: action.id,
                        name: action.name,
                    },
                }),
            };
        case CARDSET_RENAME_REQUEST:
            const cardset = state.byId[action.cardSetId];

            return {
                ...state,
                byId: {
                    ...state.byId,
                    [cardset.id]: {
                        ...cardset,
                        name: action.newName,
                    },
                },
            };
        case CARDSET_LIST_SUCCESS:
            return Object.assign({}, state, {
                byId: action.byId,
                allIds: action.allIds,
            });
        case CARDSET_LIST_RESET:
            return Object.assign({}, state, {
                byId: {},
                allIds: [],
            });
        default:
            return state;
    }
}

function resizeFields(fields: FieldInfoByCardCollection, widthRatio: number, heightRatio: number) {
    let newFields = { ...fields };
    for (const cardId in newFields) {
        let cardFields = { ...fields[cardId] };
        for (const fieldId in cardFields) {
            let fieldInfo = { ...cardFields[fieldId] };
            fieldInfo.x = (fieldInfo.x - BLEED_WIDTH) * widthRatio + BLEED_WIDTH;
            fieldInfo.y = (fieldInfo.y - BLEED_WIDTH) * heightRatio + BLEED_WIDTH;
            fieldInfo.width *= widthRatio;
            fieldInfo.height *= heightRatio;
            if (fieldInfo.type === 'image') {
                if (fieldInfo.cx) {
                    fieldInfo.cx *= widthRatio;
                }
                if (fieldInfo.cy) {
                    fieldInfo.cy *= heightRatio;
                }
            } else if (fieldInfo.type === 'text') {
                fieldInfo.fontSize *= heightRatio;
            }
            cardFields[fieldId] = fieldInfo;
        }
        newFields[cardId] = cardFields;
    }
    return newFields;
}

export function cardset(state: CardSetState = DefaultCardSetState, action: CardSetAction): CardSetState {
    switch (action.type) {
        case CARDSET_SELECT_REQUEST:
            return Object.assign({}, state, {
                activity: state.activity | ACTIVITY_SELECTING,
            });
        case CARDSET_SELECT_SUCCESS: {
            return {
                ...state,
                activity: state.activity & ~ACTIVITY_SELECTING,
                width: action.data.width || 63.5,
                height: action.data.height || 88.9,
                isTwoSided: action.data.isTwoSided || false,
                snappingDistance: action.data.snappingDistance || 1,
                version: action.data.version,
                cardsAllIds: action.data.cardsAllIds || [],
                cardsById: action.data.cardsById || {},
                fields: action.data.fields || {},
                fieldsAllIds: action.data.fieldsAllIds || [],
                activeCardId: undefined,
                activeFieldId: undefined,
                isBackActive: false,
                zoom: action.data.zoom || 1,
            };
        }
        case CARDSET_SELECT_FAILURE:
            return Object.assign({}, state, {
                activity: state.activity & ~ACTIVITY_SELECTING,
            });
        case CARDSET_CREATE_CARD: {
            let cardFields: FieldInfoCollection = {};
            if (state.cardsAllIds.length > 0) {
                cardFields = {
                    ...state.fields[state.cardsAllIds[0]],
                };

                for (const fieldId of state.fieldsAllIds) {
                    let fieldInfo = { ...cardFields[fieldId] };
                    if (fieldInfo.type === 'text') {
                        fieldInfo.value = '';
                    } else if (fieldInfo.type === 'image') {
                        delete fieldInfo.url;
                        delete fieldInfo.base64;
                    }
                    cardFields[fieldId] = fieldInfo;
                }
            }
            return {
                ...state,
                cardsById: {
                    ...state.cardsById,
                    [action.card.id]: action.card,
                },
                cardsAllIds: state.cardsAllIds ? state.cardsAllIds.concat(action.card.id) : [action.card.id],
                fields: {
                    ...state.fields,
                    [action.card.id]: cardFields,
                },
            };
        }
        case CARDSET_CLONE_CARD: {
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
                fields: {
                    ...state.fields,
                    [newCard.id]: {
                        ...state.fields[action.card.id],
                    },
                },
            };
        }
        case CARDSET_REMOVE_CARD: {
            const cardId = action.card.id;
            let cardsById = { ...state.cardsById };
            delete cardsById[cardId];

            let fields = { ...state.fields };
            if (cardId in fields) {
                delete fields[cardId];
            }

            let activeCardId = state.activeCardId === cardId ? undefined : state.activeCardId;

            const cardsAllIds = state.cardsAllIds.filter(id => id !== cardId);

            let fieldsAllIds = state.fieldsAllIds;
            if (cardsAllIds.length === 0) {
                fieldsAllIds = [];
            }

            return {
                ...state,
                cardsById,
                cardsAllIds,
                fieldsAllIds,
                fields,
                activeCardId,
            };
        }
        case CARDSET_UPDATE_CARD_COUNT: {
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
        case CARDSET_ADD_TEXT_FIELD: {
            if (state.cardsAllIds.length === 0) {
                return state;
            }

            let textSettings = { ...state.textSettings };
            const id = shortid.generate();
            let fields: FieldInfoByCardCollection = {};
            for (const cardId of state.cardsAllIds) {
                fields[cardId] = {
                    ...state.fields[cardId],
                    [id]: {
                        type: 'text',
                        id,
                        x: 5,
                        y: 5,
                        width: 20,
                        height: 10,
                        angle: 0,
                        isOnBack: state.isBackActive,
                        value: '',
                        align: textSettings.align,
                        color: textSettings.color,
                        fontFamily: textSettings.fontFamily,
                        fontVariant: textSettings.fontVariant,
                        fontSize: textSettings.fontSize,
                        lineHeight: textSettings.lineHeight || DEFAULT_LINE_HEIGHT,
                    },
                };
            }

            return {
                ...state,
                fieldsAllIds: [...state.fieldsAllIds, id],
                fields,
            };
        }
        case CARDSET_ADD_IMAGE_FIELD: {
            if (state.cardsAllIds.length === 0) {
                return state;
            }

            const id = shortid.generate();
            let fields: FieldInfoByCardCollection = {};
            for (const cardId of state.cardsAllIds) {
                fields[cardId] = {
                    ...state.fields[cardId],
                    [id]: {
                        type: 'image',
                        id,
                        x: 5,
                        y: 5,
                        width: 20,
                        height: 20,
                        angle: 0,
                        isOnBack: state.isBackActive,
                        crop: true,
                    },
                };
            }

            return {
                ...state,
                fieldsAllIds: [...state.fieldsAllIds, id],
                fields,
            };
        }
        case CARDSET_CHANGE_ACTIVE_FIELD_NAME: {
            if (state.activeFieldId !== undefined) {
                let fields: FieldInfoByCardCollection = {};
                let id = state.activeFieldId;

                for (const cardId of state.cardsAllIds) {
                    fields[cardId] = {
                        ...state.fields[cardId],
                        [id]: {
                            ...state.fields[cardId][id],
                            name: action.name,
                        },
                    };
                }

                return {
                    ...state,
                    fields,
                };
            }

            return state;
        }

        case CARDSET_REMOVE_ACTIVE_FIELD: {
            const fieldId = state.activeFieldId;
            if (fieldId !== undefined) {
                let fieldsAllIds = [...state.fieldsAllIds];
                let fieldIndex = fieldsAllIds.indexOf(fieldId);
                if (fieldIndex !== -1) {
                    fieldsAllIds.splice(fieldIndex, 1);
                }

                let fields = { ...state.fields };
                for (const cardId in fields) {
                    if (fieldId in fields[cardId] && !fields[cardId][fieldId].locked) {
                        let cardFields = { ...fields[cardId] };
                        delete cardFields[fieldId];
                        fields[cardId] = cardFields;
                    }
                }

                return {
                    ...state,
                    fieldsAllIds,
                    fields,
                    activeFieldId: undefined,
                };
            }
            return state;
        }
        case CARDSET_RAISE_ACTIVE_FIELD: {
            let fieldsAllIds = [...state.fieldsAllIds];

            if (state.activeFieldId !== undefined) {
                let index = fieldsAllIds.indexOf(state.activeFieldId);
                if (index !== -1 && index < fieldsAllIds.length - 1) {
                    fieldsAllIds.splice(index + 1, 0, fieldsAllIds.splice(index, 1)[0]);
                }
            }

            return {
                ...state,
                fieldsAllIds,
            };
        }
        case CARDSET_RAISE_ACTIVE_FIELD_TO_TOP: {
            let fieldsAllIds = [...state.fieldsAllIds];

            if (state.activeFieldId !== undefined) {
                let index = fieldsAllIds.indexOf(state.activeFieldId);
                if (index !== -1) {
                    fieldsAllIds.push(fieldsAllIds.splice(index, 1)[0]);
                }
            }

            return {
                ...state,
                fieldsAllIds,
            };
        }
        case CARDSET_LOWER_ACTIVE_FIELD: {
            let fieldsAllIds = [...state.fieldsAllIds];

            if (state.activeFieldId !== undefined) {
                let index = fieldsAllIds.indexOf(state.activeFieldId);
                if (index > 0) {
                    fieldsAllIds.splice(index - 1, 0, fieldsAllIds.splice(index, 1)[0]);
                }
            }

            return {
                ...state,
                fieldsAllIds,
            };
        }
        case CARDSET_LOWER_ACTIVE_FIELD_TO_BOTTOM: {
            let fieldsAllIds = [...state.fieldsAllIds];

            if (state.activeFieldId !== undefined) {
                let index = fieldsAllIds.indexOf(state.activeFieldId);
                if (index !== -1) {
                    fieldsAllIds.unshift(fieldsAllIds.splice(index, 1)[0]);
                }
            }

            return {
                ...state,
                fieldsAllIds,
            };
        }
        case CARDSET_LOCK_ACTIVE_FIELD: {
            if (state.activeFieldId) {
                let fields = { ...state.fields };
                let fieldId = state.activeFieldId;
                for (const cardId in fields) {
                    let cardFields = { ...fields[cardId] };
                    if (fieldId in cardFields) {
                        cardFields[fieldId] = {
                            ...cardFields[fieldId],
                            locked: true,
                        };
                    }
                    fields[cardId] = cardFields;
                }

                return {
                    ...state,
                    fields,
                };
            }

            return state;
        }
        case CARDSET_UNLOCK_ACTIVE_FIELD: {
            if (state.activeFieldId) {
                let fields = { ...state.fields };
                let fieldId = state.activeFieldId;
                for (const cardId in fields) {
                    let cardFields = { ...fields[cardId] };
                    if (fieldId in cardFields) {
                        cardFields[fieldId] = {
                            ...cardFields[fieldId],
                            locked: false,
                        };
                    }
                    fields[cardId] = cardFields;
                }

                return {
                    ...state,
                    fields,
                };
            }

            return state;
        }
        case CARDSET_CHANGE_FIT_FOR_ACTIVE_FIELD: {
            if (state.activeFieldId) {
                let fields = { ...state.fields };
                let fieldId = state.activeFieldId;
                for (const cardId in fields) {
                    let cardFields = { ...fields[cardId] };
                    if (fieldId in cardFields) {
                        let fieldInfo = { ...cardFields[fieldId] };
                        if (fieldInfo.type === 'image') {
                            fieldInfo.fit = action.fit;
                        }
                        cardFields[fieldId] = fieldInfo;
                    }
                    fields[cardId] = cardFields;
                }

                return {
                    ...state,
                    fields,
                };
            }

            return state;
        }
        case CARDSET_CHANGE_CROP_FOR_ACTIVE_FIELD: {
            if (state.activeFieldId) {
                let fields = { ...state.fields };
                let fieldId = state.activeFieldId;
                for (const cardId in fields) {
                    let cardFields = { ...fields[cardId] };
                    if (fieldId in cardFields) {
                        let fieldInfo = { ...cardFields[fieldId] };
                        if (fieldInfo.type === 'image') {
                            fieldInfo.crop = action.crop;
                        }
                        cardFields[fieldId] = fieldInfo;
                    }
                    fields[cardId] = cardFields;
                }

                return {
                    ...state,
                    fields,
                };
            }

            return state;
        }
        case CARDSET_CHANGE_UNCLICKABLE_FOR_ACTIVE_FIELD: {
            if (state.activeFieldId) {
                let fields = { ...state.fields };
                let fieldId = state.activeFieldId;
                for (const cardId in fields) {
                    let cardFields = { ...fields[cardId] };
                    if (fieldId in cardFields) {
                        let fieldInfo = { ...cardFields[fieldId] };
                        fieldInfo.unclickable = action.unclickable;
                        cardFields[fieldId] = fieldInfo;
                    }
                    fields[cardId] = cardFields;
                }

                return {
                    ...state,
                    fields,
                };
            }

            return state;
        }
        case CARDSET_CHANGE_WIDTH: {
            if (!action.width || action.width <= 0) {
                return state;
            }

            let height = state.height;
            if (action.maintainAspectRatio) {
                height = action.width * (state.height / state.width);
            }

            let fields = state.fields;
            if (action.resizeContent) {
                fields = resizeFields(fields, action.width / state.width, height / state.height);
            }

            return {
                ...state,
                width: action.width,
                height,
                fields,
            };
        }
        case CARDSET_CHANGE_HEIGHT: {
            if (!action.height || action.height <= 0) {
                return state;
            }

            let width = state.width;
            if (action.maintainAspectRatio) {
                width = action.height * (state.width / state.height);
            }

            let fields = state.fields;
            if (action.resizeContent) {
                fields = resizeFields(fields, width / state.width, action.height / state.height);
            }

            return {
                ...state,
                height: action.height,
                width,
                fields,
            };
        }
        case CARDSET_CHANGE_IS_TWO_SIDED: {
            return {
                ...state,
                isTwoSided: action.isTwoSided,
            };
        }
        case CARDSET_CHANGE_SNAPPING_DISTANCE: {
            return {
                ...state,
                snappingDistance: action.snappingDistance,
            };
        }
        case CARDSET_CHANGE_FIELD_POSITION: {
            let x = action.x;
            let y = action.y;
            let snappingDistance = state.snappingDistance;

            if (snappingDistance !== 0) {
                x = Math.round(x / snappingDistance) * snappingDistance;
                y = Math.round(y / snappingDistance) * snappingDistance;
            }

            let fields = { ...state.fields };
            let fieldId = action.fieldId;
            let cardsToFix = action.cardId ? [action.cardId] : state.cardsAllIds;

            for (const cardId of cardsToFix) {
                let cardFields = { ...fields[cardId] };
                if (fieldId in cardFields) {
                    cardFields[fieldId] = {
                        ...cardFields[fieldId],
                        x,
                        y,
                    };
                }
                fields[cardId] = cardFields;
            }

            return {
                ...state,
                fields,
            };
        }
        case CARDSET_CHANGE_FIELD_PAN: {
            let { cx, cy } = action;

            let fields = { ...state.fields };
            let fieldId = action.fieldId;
            let cardsToFix = state.applyToAllCards || action.cardId === undefined ? state.cardsAllIds : [action.cardId];

            for (const cardId of cardsToFix) {
                let cardFields = { ...fields[cardId] };
                if (fieldId in cardFields) {
                    let fieldInfo = cardFields[fieldId];
                    if (fieldInfo.type === 'image') {
                        let { width, height, zoom, fit, imageWidth, imageHeight } = fieldInfo;
                        zoom = zoom || 1;
                        imageHeight = imageHeight || 1;
                        imageWidth = imageWidth || 1;

                        let fitImageWidth = width;
                        let fitImageHeight = height;
                        if (fit === 'width' || fit === undefined) {
                            fitImageHeight = width * (imageHeight / imageWidth);
                        } else if (fit === 'height') {
                            fitImageWidth = height * (imageWidth / imageHeight);
                        }
                        cx = Math.min(Math.max(width - zoom * fitImageWidth, cx), 0);
                        cy = Math.min(Math.max(height - zoom * fitImageHeight, cy), 0);

                        cardFields[fieldId] = {
                            ...fieldInfo,
                            cx,
                            cy,
                        };
                    }
                }
                fields[cardId] = cardFields;
            }

            return {
                ...state,
                fields,
            };
        }
        case CARDSET_CHANGE_FIELD_ZOOM: {
            let zoom = action.zoom;

            let fields = { ...state.fields };
            let fieldId = action.fieldId;

            let cardsToFix = state.applyToAllCards || action.cardId === undefined ? state.cardsAllIds : [action.cardId];

            for (const cardId of cardsToFix) {
                let cardFields = { ...fields[cardId] };
                if (fieldId in cardFields) {
                    let fieldInfo = cardFields[fieldId];
                    if (fieldInfo.type === 'image') {
                        let { fit, width, height, imageWidth, imageHeight } = fieldInfo;

                        imageHeight = imageHeight || 1;
                        imageWidth = imageWidth || 1;

                        let fitImageWidth = width;
                        let fitImageHeight = height;
                        if (fit === 'width' || fit === undefined) {
                            fitImageHeight = width * (imageHeight / imageWidth);
                        } else if (fit === 'height') {
                            fitImageWidth = height * (imageWidth / imageHeight);
                        }

                        let cx = fieldInfo.cx || 0;
                        let cy = fieldInfo.cy || 0;
                        let oldZoom = fieldInfo.zoom || 1;
                        cx = cx + ((oldZoom - zoom) * fitImageWidth) / 2;
                        cy = cy + ((oldZoom - zoom) * fitImageHeight) / 2;

                        cx = Math.min(Math.max(width - zoom * fitImageWidth, cx), 0);
                        cy = Math.min(Math.max(height - zoom * fitImageHeight, cy), 0);

                        cardFields[fieldId] = {
                            ...fieldInfo,
                            zoom,
                            cx,
                            cy,
                        };
                    }
                }
                fields[cardId] = cardFields;
            }

            return {
                ...state,
                fields,
            };
        }
        case CARDSET_CHANGE_FIELD_SIZE: {
            let width = action.width;
            let height = action.height;
            let snappingDistance = state.snappingDistance;

            if (snappingDistance !== 0) {
                width = Math.round(width / snappingDistance) * snappingDistance;
                height = Math.round(height / snappingDistance) * snappingDistance;
            }

            let fields = { ...state.fields };
            let fieldId = action.fieldId;
            let cardsToFix = action.cardId ? [action.cardId] : state.cardsAllIds;

            for (const cardId of cardsToFix) {
                let cardFields = { ...fields[cardId] };
                if (fieldId in cardFields) {
                    let fieldInfo = { ...cardFields[fieldId] };

                    let nx = fieldInfo.x + fieldInfo.width / 2;
                    let ny = fieldInfo.y + fieldInfo.height / 2;
                    let { rx, ry } = rotateVec(
                        (width - fieldInfo.width) / 2,
                        (height - fieldInfo.height) / 2,
                        fieldInfo.angle,
                    );

                    nx = nx + rx - width / 2;
                    ny = ny + ry - height / 2;

                    if (fieldInfo.type === 'image' && fieldInfo.cx && fieldInfo.cy) {
                        if (fieldInfo.fit === 'width' || fieldInfo.fit === undefined) {
                            let ratio = width / fieldInfo.width;
                            fieldInfo.cx *= ratio;
                            fieldInfo.cy *= ratio;
                        } else if (fieldInfo.fit === 'height') {
                            let ratio = height / fieldInfo.height;
                            fieldInfo.cx *= ratio;
                            fieldInfo.cy *= ratio;
                        } else {
                            fieldInfo.cx *= width / fieldInfo.width;
                            fieldInfo.cy *= height / fieldInfo.height;
                        }
                    }

                    fieldInfo.x = nx;
                    fieldInfo.y = ny;
                    fieldInfo.width = width;
                    fieldInfo.height = height;
                    cardFields[fieldId] = fieldInfo;
                }
                fields[cardId] = cardFields;
            }

            return {
                ...state,
                fields,
            };
        }
        case CARDSET_CHANGE_FIELD_ANGLE: {
            let angle = action.angle;

            let fields = { ...state.fields };
            let fieldId = action.fieldId;

            let cardsToFix = action.cardId ? [action.cardId] : state.cardsAllIds;

            for (const cardId of cardsToFix) {
                let cardFields = { ...fields[cardId] };
                if (fieldId in cardFields) {
                    cardFields[fieldId] = {
                        ...cardFields[fieldId],
                        angle,
                    };
                }
                fields[cardId] = cardFields;
            }

            return {
                ...state,
                fields,
            };
        }
        case CARDSET_CHANGE_ACTIVE_TEXT_FIELD_ALIGN: {
            let textSettings = {
                ...state.textSettings,
                align: action.align,
            };

            if (state.activeFieldId) {
                let align = action.align;

                let fields = { ...state.fields };
                let fieldId = state.activeFieldId;
                for (const cardId in fields) {
                    let cardFields = { ...fields[cardId] };
                    if (fieldId in cardFields) {
                        let fieldInfo = cardFields[fieldId];
                        if (fieldInfo.type === 'text') {
                            cardFields[fieldId] = {
                                ...fieldInfo,
                                align,
                            };
                        }
                    }
                    fields[cardId] = cardFields;
                }

                return {
                    ...state,
                    fields,
                    textSettings,
                };
            } else {
                return {
                    ...state,
                    textSettings,
                };
            }
        }
        case CARDSET_CHANGE_ACTIVE_TEXT_FIELD_COLOR: {
            let textSettings = {
                ...state.textSettings,
                color: action.color,
            };

            if (state.activeFieldId) {
                let color = action.color;

                let fields = { ...state.fields };
                let fieldId = state.activeFieldId;
                for (const cardId in fields) {
                    let cardFields = { ...fields[cardId] };
                    if (fieldId in cardFields) {
                        let fieldInfo = cardFields[fieldId];
                        if (fieldInfo.type === 'text') {
                            cardFields[fieldId] = {
                                ...fieldInfo,
                                color,
                            };
                        }
                    }
                    fields[cardId] = cardFields;
                }

                return {
                    ...state,
                    fields,
                    textSettings,
                };
            } else {
                return {
                    ...state,
                    textSettings,
                };
            }
        }
        case CARDSET_CHANGE_ACTIVE_TEXT_FIELD_FONT_FAMILY: {
            let textSettings = {
                ...state.textSettings,
                color: action.fontFamily,
            };

            if (state.activeFieldId) {
                let fontFamily = action.fontFamily;

                let fields = { ...state.fields };
                let fieldId = state.activeFieldId;
                for (const cardId in fields) {
                    let cardFields = { ...fields[cardId] };
                    if (fieldId in cardFields) {
                        let fieldInfo = cardFields[fieldId];
                        if (fieldInfo.type === 'text') {
                            cardFields[fieldId] = {
                                ...fieldInfo,
                                fontFamily,
                            };
                        }
                    }
                    fields[cardId] = cardFields;
                }

                return {
                    ...state,
                    fields,
                    textSettings,
                };
            } else {
                return {
                    ...state,
                    textSettings,
                };
            }
        }
        case CARDSET_CHANGE_ACTIVE_TEXT_FIELD_FONT_VARIANT: {
            let textSettings = {
                ...state.textSettings,
                color: action.fontVariant,
            };

            if (state.activeFieldId) {
                let fontVariant = action.fontVariant;

                let fields = { ...state.fields };
                let fieldId = state.activeFieldId;
                for (const cardId in fields) {
                    let cardFields = { ...fields[cardId] };
                    if (fieldId in cardFields) {
                        let fieldInfo = cardFields[fieldId];
                        if (fieldInfo.type === 'text') {
                            cardFields[fieldId] = {
                                ...fieldInfo,
                                fontVariant,
                            };
                        }
                    }
                    fields[cardId] = cardFields;
                }

                return {
                    ...state,
                    fields,
                    textSettings,
                };
            } else {
                return {
                    ...state,
                    textSettings,
                };
            }
        }
        case CARDSET_CHANGE_ACTIVE_TEXT_FIELD_FONT_FAMILY_AND_VARIANT: {
            let textSettings = {
                ...state.textSettings,
                fontFamily: action.fontFamily,
                fontVariant: action.fontVariant,
            };

            if (state.activeFieldId) {
                let fontFamily = action.fontFamily;
                let fontVariant = action.fontVariant;

                let fields = { ...state.fields };
                let fieldId = state.activeFieldId;
                for (const cardId in fields) {
                    let cardFields = { ...fields[cardId] };
                    if (fieldId in cardFields) {
                        let fieldInfo = cardFields[fieldId];
                        if (fieldInfo.type === 'text') {
                            cardFields[fieldId] = {
                                ...fieldInfo,
                                fontFamily,
                                fontVariant,
                            };
                        }
                    }
                    fields[cardId] = cardFields;
                }

                return {
                    ...state,
                    fields,
                    textSettings,
                };
            } else {
                return {
                    ...state,
                    textSettings,
                };
            }
        }
        case CARDSET_CHANGE_ACTIVE_TEXT_FIELD_FONT_SIZE: {
            let textSettings = {
                ...state.textSettings,
                fontSize: action.fontSize,
            };

            if (state.activeFieldId) {
                let fontSize = action.fontSize;

                let fields = { ...state.fields };
                let fieldId = state.activeFieldId;
                for (const cardId in fields) {
                    let cardFields = { ...fields[cardId] };
                    if (fieldId in cardFields) {
                        let fieldInfo = cardFields[fieldId];
                        if (fieldInfo.type === 'text') {
                            cardFields[fieldId] = {
                                ...fieldInfo,
                                fontSize,
                            };
                        }
                    }
                    fields[cardId] = cardFields;
                }

                return {
                    ...state,
                    fields,
                    textSettings,
                };
            } else {
                return {
                    ...state,
                    textSettings,
                };
            }
        }
        case CARDSET_CHANGE_ACTIVE_TEXT_FIELD_LINE_HEIGHT: {
            let textSettings = {
                ...state.textSettings,
                lineHeight: action.lineHeight,
            };

            if (state.activeFieldId) {
                let lineHeight = action.lineHeight;

                let fields = { ...state.fields };
                let fieldId = state.activeFieldId;
                for (const cardId in fields) {
                    let cardFields = { ...fields[cardId] };
                    if (fieldId in cardFields) {
                        let fieldInfo = cardFields[fieldId];
                        if (fieldInfo.type === 'text') {
                            cardFields[fieldId] = {
                                ...fieldInfo,
                                lineHeight,
                            };
                        }
                    }
                    fields[cardId] = cardFields;
                }

                return {
                    ...state,
                    fields,
                    textSettings,
                };
            } else {
                return {
                    ...state,
                    textSettings,
                };
            }
        }
        case CARDSET_CHANGE_TEXT: {
            let cardFields = { ...state.fields[action.cardId] };

            const fieldInfo = cardFields[action.fieldId];
            const name = fieldInfo.name || fieldInfo.id;

            for (const fieldId in cardFields) {
                const testFieldInfo = cardFields[fieldId];

                if ((testFieldInfo.name === name || testFieldInfo.id === name) && testFieldInfo.type === 'text') {
                    cardFields[fieldId] = {
                        ...testFieldInfo,
                        value: action.textInfo.value,
                    };
                }
            }

            return {
                ...state,
                fields: {
                    ...state.fields,
                    [action.cardId]: cardFields,
                },
            };
        }
        case CARDSET_CHANGE_IMAGE: {
            let cardsToFix = state.applyToAllCards || action.cardId === undefined ? state.cardsAllIds : [action.cardId];

            let fields = { ...state.fields };

            for (const cardId of cardsToFix) {
                let cardFields = { ...state.fields[cardId] };

                const fieldInfo = cardFields[action.fieldId];
                const name = fieldInfo.name || fieldInfo.id;

                for (const fieldId in cardFields) {
                    const testFieldInfo = cardFields[fieldId];

                    if ((testFieldInfo.name === name || testFieldInfo.id === name) && testFieldInfo.type === 'image') {
                        cardFields[fieldId] = {
                            ...testFieldInfo,
                            url: 'url' in action.imageInfo ? action.imageInfo.url : testFieldInfo.url,
                            base64: 'base64' in action.imageInfo ? action.imageInfo.base64 : testFieldInfo.base64,
                            color: 'color' in action.imageInfo ? action.imageInfo.color : testFieldInfo.color,
                            imageWidth: 'width' in action.imageInfo ? action.imageInfo.width : testFieldInfo.imageWidth,
                            imageHeight:
                                'height' in action.imageInfo ? action.imageInfo.height : testFieldInfo.imageHeight,
                            cx: 0,
                            cy: 0,
                            zoom: 0,
                        };
                    }
                }

                fields[cardId] = cardFields;
            }

            return {
                ...state,
                fields,
            };
        }
        case CARDSET_CHANGE_IMAGE_BASE64: {
            let cardFields = { ...state.fields[action.cardId] };

            const fieldInfo = cardFields[action.fieldId];
            const name = fieldInfo.name || fieldInfo.id;

            for (const fieldId in cardFields) {
                const testFieldInfo = cardFields[fieldId];

                if ((testFieldInfo.name === name || testFieldInfo.id === name) && testFieldInfo.type === 'image') {
                    cardFields[fieldId] = {
                        ...testFieldInfo,
                        base64: action.base64,
                        cx: 0,
                        cy: 0,
                        zoom: 0,
                    };
                }
            }

            return {
                ...state,
                fields: {
                    ...state.fields,
                    [action.cardId]: cardFields,
                },
            };
        }
        case CARDSET_SET_ACTIVE_CARD_AND_FIELD: {
            let textSettings = { ...state.textSettings };
            let activeSidebar = state.activeSidebar;

            if (activeSidebar !== SidebarState.Measurements && action.cardId !== undefined) {
                activeSidebar = SidebarState.Details;
            }

            if (action.cardId !== undefined && action.fieldId !== undefined) {
                const fieldInfo = state.fields[action.cardId][action.fieldId];

                if (fieldInfo.type === 'text') {
                    textSettings.align = fieldInfo.align;
                    textSettings.color = fieldInfo.color;
                    textSettings.fontFamily = fieldInfo.fontFamily;
                    textSettings.fontVariant = fieldInfo.fontVariant;
                    textSettings.fontSize = fieldInfo.fontSize;
                    textSettings.lineHeight = fieldInfo.lineHeight;

                    if (activeSidebar !== SidebarState.Measurements) {
                        activeSidebar = SidebarState.Text;
                    }
                } else {
                    if (activeSidebar !== SidebarState.Measurements) {
                        activeSidebar = SidebarState.Image;
                    }
                }
            }

            return {
                ...state,
                activeCardId: action.cardId,
                isBackActive: action.isBackActive,
                activeFieldId: action.fieldId,
                textSettings,
                activeSidebar,
            };
        }

        case CARDSET_CHANGE_APPLY_TO_ALLCARDS: {
            return {
                ...state,
                applyToAllCards: action.applyToAllCards,
            };
        }

        case CARDSET_SET_SIDEBAR_STATE: {
            return {
                ...state,
                activeSidebar: action.sidebarState,
            };
        }
        case CARDSET_SET_ZOOM: {
            return {
                ...state,
                zoom: action.zoom,
            };
        }
        case CARDSET_IMPORT_DATA: {
            return {
                ...state,
                ...action.data,
            };
        }
        default:
            return state;
    }
}

export function images(state: ImageState = DefaultImageState, action: ImageListAction): ImageState {
    switch (action.type) {
        case IMAGE_LIST_REQUEST:
            return Object.assign({}, state, {
                filter: action.filter,
            });
        case IMAGE_LIST_SUCCESS:
            return Object.assign({}, state, {
                images: action.images,
            });
        default:
            return state;
    }
}

const undoableCardset = undoable(cardset, {
    ignoreInitialState: true,
    undoType: CARDSET_UNDO,
    redoType: CARDSET_REDO,
    groupBy: (action: Action) => {
        if (
            action.type === 'CARDSET_CHANGE_FIELD_SIZE' ||
            action.type === 'CARDSET_CHANGE_FIELD_POSITION' ||
            action.type === 'CARDSET_CHANGE_FIELD_ANGLE' ||
            action.type === 'CARDSET_CHANGE_FIELD_ZOOM' ||
            action.type === 'CARDSET_CHANGE_FIELD_PAN'
        ) {
            return action.group;
        }
        return null;
    },
    filter: (action: Action) => {
        if (!action.type.startsWith('CARDSET_')) {
            return false;
        }

        if (action.type === CARDSET_SELECT_REQUEST || action.type === CARDSET_SET_ACTIVE_CARD_AND_FIELD) {
            return false;
        }
        return true;
    },
});

const reducers = combineReducers({
    message,
    auth,
    signup,
    games,
    cardsets,
    cardset: undoableCardset,
    images,
});

export default reducers;
