import { combineReducers } from 'redux';
import shortid from 'shortid';

import {
    CARDSET_ADD_IMAGE_PLACEHOLDER,
    CARDSET_ADD_TEXT_PLACEHOLDER,
    CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_ALIGN,
    CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_COLOR,
    CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_FONT_FAMILY,
    CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_FONT_FAMILY_AND_VARIANT,
    CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_FONT_SIZE,
    CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_FONT_VARIANT,
    CARDSET_CHANGE_HEIGHT,
    CARDSET_CHANGE_IMAGE,
    CARDSET_CHANGE_PLACEHOLDER_ANGLE,
    CARDSET_CHANGE_PLACEHOLDER_POSITION,
    CARDSET_CHANGE_PLACEHOLDER_SIZE,
    CARDSET_CHANGE_TEXT,
    CARDSET_CHANGE_WIDTH,
    CARDSET_CLONE_CARD,
    CARDSET_CREATE_CARD,
    CARDSET_CREATE_FAILURE,
    CARDSET_CREATE_REQUEST,
    CARDSET_CREATE_SUCCESS,
    CARDSET_LIST_FAILURE,
    CARDSET_LIST_REQUEST,
    CARDSET_LIST_RESET,
    CARDSET_LIST_SUCCESS,
    CARDSET_REMOVE_ACTIVE_PLACEHOLDER,
    CARDSET_REMOVE_CARD,
    CARDSET_SELECT_FAILURE,
    CARDSET_SELECT_REQUEST,
    CARDSET_SELECT_SUCCESS,
    CARDSET_SET_ACTIVE_CARD_AND_PLACEHOLDER,
    CARDSET_SET_SIDEBAR_STATE,
    CARDSET_SET_ZOOM,
    CARDSET_UPDATE_CARD_COUNT,
    CARDSET_UPDATE_DATA_FAILURE,
    CARDSET_UPDATE_DATA_REQUEST,
    CARDSET_UPDATE_DATA_SUCCESS,
    CardSetAction,
    CardSetsCollection,
    CardsCollection,
    GAME_CREATE_FAILURE,
    GAME_CREATE_PDF_FAILURE,
    GAME_CREATE_PDF_REQUEST,
    GAME_CREATE_PDF_SUCCESS,
    GAME_CREATE_REQUEST,
    GAME_CREATE_SUCCESS,
    GAME_LIST_FAILURE,
    GAME_LIST_REQUEST,
    GAME_LIST_RESET,
    GAME_LIST_SUCCESS,
    GAME_SELECT_FAILURE,
    GAME_SELECT_REQUEST,
    GAME_SELECT_SUCCESS,
    GameAction,
    GamesCollection,
    IMAGE_LIST_FAILURE,
    IMAGE_LIST_REQUEST,
    IMAGE_LIST_SUCCESS,
    IdsArray,
    ImageArray,
    ImageListAction,
    ImagePlaceholderType,
    LOGIN_FAILURE,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGOUT_SUCCESS,
    LoginAction,
    MESSAGE_DISPLAY,
    MESSAGE_HIDE,
    MessageAction,
    MessageType,
    PlaceholdersCollection,
    PlaceholdersImageInfoByCardCollection,
    PlaceholdersImageInfoCollection,
    PlaceholdersTextInfoByCardCollection,
    PlaceholdersTextInfoCollection,
    SIGNUP_FAILURE,
    SIGNUP_REQUEST,
    SIGNUP_SUCCESS,
    SidebarState,
    SignUpAction,
    TextPlaceholderType,
} from './actions';
import { DEFAULT_FONT, DEFAULT_FONT_SIZE, DEFAULT_FONT_VARIANT } from './fontLoader';

export const ACTIVITY_CREATING = 0x1;
export const ACTIVITY_LISTING = 0x2;
export const ACTIVITY_SELECTING = 0x4;
export const ACTIVITY_CREATING_PDF = 0x8;
export const ACTIVITY_UPDATING = 0x10;

export interface MessageState {
    messages: MessageType[];
}

export const DefaultMessageState: MessageState = {
    messages: [],
};

export interface AuthState {
    isAuthenticated: boolean;
    user: string;
}

export const DefaultAuthState: AuthState = {
    isAuthenticated: false,
    user: '',
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
}

export interface CardSetState {
    width: number;
    height: number;
    byId: CardSetsCollection;
    allIds: IdsArray;
    activity: number;
    active: string | null;
    cardsAllIds: IdsArray;
    cardsById: CardsCollection;
    activeCard: string | null;
    activePlaceholder: string | null;
    placeholders: PlaceholdersCollection;
    placeholdersAllIds: IdsArray;
    texts: PlaceholdersTextInfoByCardCollection;
    images: PlaceholdersImageInfoByCardCollection;
    textSettings: TextSettings;
    activeSidebar: SidebarState | null;
    zoom: number;
}

export const DefaultCardSetState: CardSetState = {
    width: 63.5,
    height: 88.9,
    byId: {},
    allIds: [],
    activity: 0,
    active: null,
    placeholders: {},
    placeholdersAllIds: [],
    cardsById: {},
    cardsAllIds: [],
    activeCard: null,
    activePlaceholder: null,
    texts: {},
    images: {},
    textSettings: {
        align: 'left',
        color: '#000000',
        fontFamily: DEFAULT_FONT,
        fontVariant: DEFAULT_FONT_VARIANT,
        fontSize: DEFAULT_FONT_SIZE,
    },
    activeSidebar: null,
    zoom: 1,
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
    cardsets: CardSetState;
    images: ImageState;
}

export const DefaultState: State = {
    message: DefaultMessageState,
    auth: DefaultAuthState,
    signup: DefaultSignUpState,
    games: DefaultGameState,
    cardsets: DefaultCardSetState,
    images: DefaultImageState,
};

export function message(state: MessageState = DefaultMessageState, action: MessageAction): MessageState {
    switch (action.type) {
        case MESSAGE_DISPLAY:
            return Object.assign({}, state, {
                messages: state.messages.concat(action.message),
            });
        case MESSAGE_HIDE:
            return Object.assign({}, state, {
                messages: state.messages.filter(m => m.id !== action.message.id),
            });
        default:
            return state;
    }
}

export function auth(state: AuthState = DefaultAuthState, action: LoginAction): AuthState {
    switch (action.type) {
        case LOGIN_REQUEST:
            return Object.assign({}, state, {
                isAuthenticated: false,
                user: action.creds.username,
            });
        case LOGIN_SUCCESS:
            return Object.assign({}, state, {
                isAuthenticated: true,
            });
        case LOGIN_FAILURE:
            return Object.assign({}, state, {
                isAuthenticated: false,
            });
        case LOGOUT_SUCCESS:
            return Object.assign({}, state, {
                isAuthenticated: false,
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
        case GAME_CREATE_REQUEST:
            return Object.assign({}, state, {
                activity: state.activity | ACTIVITY_CREATING,
            });
        case GAME_CREATE_SUCCESS:
            return Object.assign({}, state, {
                activity: state.activity & ~ACTIVITY_CREATING,
            });
        case GAME_CREATE_FAILURE:
            return Object.assign({}, state, {
                activity: state.activity & ~ACTIVITY_CREATING,
            });
        case GAME_LIST_REQUEST:
            return Object.assign({}, state, {
                activity: state.activity | ACTIVITY_LISTING,
            });
        case GAME_LIST_SUCCESS:
            return Object.assign({}, state, {
                activity: state.activity & ~ACTIVITY_LISTING,
                byId: action.byId,
                allIds: action.allIds,
            });
        case GAME_LIST_FAILURE:
            return Object.assign({}, state, {
                activity: state.activity & ~ACTIVITY_LISTING,
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
        default:
            return state;
    }
}

export function cardsets(state: CardSetState = DefaultCardSetState, action: CardSetAction): CardSetState {
    switch (action.type) {
        case CARDSET_CREATE_REQUEST:
            return Object.assign({}, state, {
                activity: state.activity | ACTIVITY_CREATING,
            });
        case CARDSET_CREATE_SUCCESS:
            return Object.assign({}, state, {
                activity: state.activity & ~ACTIVITY_CREATING,
            });
        case CARDSET_CREATE_FAILURE:
            return Object.assign({}, state, {
                activity: state.activity & ~ACTIVITY_CREATING,
            });
        case CARDSET_UPDATE_DATA_REQUEST:
            return Object.assign({}, state, {
                activity: state.activity | ACTIVITY_UPDATING,
            });
        case CARDSET_UPDATE_DATA_SUCCESS:
            return Object.assign({}, state, {
                activity: state.activity & ~ACTIVITY_UPDATING,
            });
        case CARDSET_UPDATE_DATA_FAILURE:
            return Object.assign({}, state, {
                activity: state.activity & ~ACTIVITY_UPDATING,
            });
        case CARDSET_LIST_REQUEST:
            return Object.assign({}, state, {
                activity: state.activity | ACTIVITY_LISTING,
            });
        case CARDSET_LIST_SUCCESS:
            return Object.assign({}, state, {
                activity: state.activity & ~ACTIVITY_LISTING,
                byId: action.byId,
                allIds: action.allIds,
            });
        case CARDSET_LIST_RESET:
            return Object.assign({}, state, {
                activity: 0,
                byId: {},
                allIds: [],
            });
        case CARDSET_LIST_FAILURE:
            return Object.assign({}, state, {
                activity: state.activity & ~ACTIVITY_LISTING,
            });
        case CARDSET_SELECT_REQUEST:
            return Object.assign({}, state, {
                activity: state.activity | ACTIVITY_SELECTING,
            });
        case CARDSET_SELECT_SUCCESS:
            return Object.assign({}, state, {
                activity: state.activity & ~ACTIVITY_SELECTING,
                active: action.id,
                byId: Object.assign({}, state.byId, {
                    [action.id]: {
                        id: action.id,
                        name: action.name,
                    },
                }),
                width: action.data.width || 63.5,
                height: action.data.height || 88.9,
                cardsAllIds: action.data.cardsAllIds || [],
                cardsById: action.data.cardsById || {},
                placeholders: action.data.placeholders || {},
                placeholdersAllIds: action.data.placeholdersAllIds || [],
                texts: action.data.texts || {},
                images: action.data.images || {},
                activeCard: null,
                activePlaceholder: null,
            });
        case CARDSET_SELECT_FAILURE:
            return Object.assign({}, state, {
                activity: state.activity & ~ACTIVITY_SELECTING,
            });
        case CARDSET_CREATE_CARD:
            return {
                ...state,
                cardsById: {
                    ...state.cardsById,
                    [action.card.id]: action.card,
                },
                cardsAllIds: state.cardsAllIds ? state.cardsAllIds.concat(action.card.id) : [action.card.id],
            };
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
                texts: {
                    ...state.texts,
                    [newCard.id]: {
                        ...state.texts[action.card.id],
                    },
                },
                images: {
                    ...state.images,
                    [newCard.id]: {
                        ...state.images[action.card.id],
                    },
                },
            };
        }
        case CARDSET_REMOVE_CARD: {
            const cardId = action.card.id;
            let cardsById = { ...state.cardsById };
            delete cardsById[cardId];

            let texts = { ...state.texts };
            if (cardId in texts) {
                delete texts[cardId];
            }

            let images = { ...state.images };
            if (cardId in images) {
                delete images[cardId];
            }

            let activeCard = state.activeCard === cardId ? null : state.activeCard;

            const cardsAllIds = state.cardsAllIds.filter(id => id !== cardId);

            let placeholders = state.placeholders;
            let placeholdersAllIds = state.placeholdersAllIds;
            if (cardsAllIds.length === 0) {
                placeholders = {};
                placeholdersAllIds = [];
            }

            return {
                ...state,
                cardsById,
                cardsAllIds,
                placeholders,
                placeholdersAllIds,
                texts,
                images,
                activeCard,
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
        case CARDSET_ADD_TEXT_PLACEHOLDER: {
            let textSettings = { ...state.textSettings };
            const id = shortid.generate();
            const textPlaceholder: TextPlaceholderType = {
                id,
                type: 'text',
                x: 5,
                y: 5,
                width: 20,
                height: 10,
                angle: 0,
                align: textSettings.align,
                color: textSettings.color,
                fontFamily: textSettings.fontFamily,
                fontVariant: textSettings.fontVariant,
                fontSize: textSettings.fontSize,
            };

            return {
                ...state,
                placeholders: {
                    ...state.placeholders,
                    [id]: textPlaceholder,
                },
                placeholdersAllIds: [...state.placeholdersAllIds, id],
            };
        }
        case CARDSET_ADD_IMAGE_PLACEHOLDER: {
            const id = shortid.generate();
            const imagePlaceholder: ImagePlaceholderType = {
                id,
                type: 'image',
                x: 5,
                y: 5,
                width: 20,
                height: 20,
                angle: 0,
            };

            return {
                ...state,
                placeholders: {
                    ...state.placeholders,
                    [id]: imagePlaceholder,
                },
                placeholdersAllIds: [...state.placeholdersAllIds, id],
            };
        }
        case CARDSET_REMOVE_ACTIVE_PLACEHOLDER: {
            const placeholderId = state.activePlaceholder;
            if (placeholderId !== undefined && placeholderId !== null) {
                let placeholders = { ...state.placeholders };
                let placeholdersAllIds = [...state.placeholdersAllIds];
                if (placeholderId in placeholders) {
                    delete placeholders[placeholderId];
                }
                let placeholderIndex = placeholdersAllIds.indexOf(placeholderId);
                if (placeholderIndex !== -1) {
                    placeholdersAllIds.splice(placeholderIndex, 1);
                }

                let texts = { ...state.texts };
                for (const cardId in texts) {
                    if (placeholderId in texts[cardId]) {
                        let placeholderTexts = { ...texts[cardId] };
                        delete placeholderTexts[placeholderId];
                        texts[cardId] = placeholderTexts;
                    }
                }

                let images = { ...state.images };
                for (const cardId in images) {
                    if (placeholderId in images[cardId]) {
                        let placeholderImages = { ...images[cardId] };
                        delete placeholderImages[placeholderId];
                        images[cardId] = placeholderImages;
                    }
                }

                return {
                    ...state,
                    placeholders,
                    placeholdersAllIds,
                    texts,
                    images,
                    activePlaceholder: null,
                };
            }
            return state;
        }
        case CARDSET_CHANGE_WIDTH: {
            return {
                ...state,
                width: action.width,
            };
        }
        case CARDSET_CHANGE_HEIGHT: {
            return {
                ...state,
                height: action.height,
            };
        }
        case CARDSET_CHANGE_PLACEHOLDER_POSITION: {
            const placeholder = {
                ...state.placeholders[action.placeholder.id],
                x: action.x,
                y: action.y,
            };

            return {
                ...state,
                placeholders: {
                    ...state.placeholders,
                    [action.placeholder.id]: placeholder,
                },
            };
        }
        case CARDSET_CHANGE_PLACEHOLDER_SIZE: {
            const placeholder = {
                ...state.placeholders[action.placeholder.id],
                width: action.width,
                height: action.height,
            };

            return {
                ...state,
                placeholders: {
                    ...state.placeholders,
                    [action.placeholder.id]: placeholder,
                },
            };
        }
        case CARDSET_CHANGE_PLACEHOLDER_ANGLE: {
            const placeholder = {
                ...state.placeholders[action.placeholder.id],
                angle: action.angle,
            };

            return {
                ...state,
                placeholders: {
                    ...state.placeholders,
                    [action.placeholder.id]: placeholder,
                },
            };
        }
        case CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_ALIGN: {
            let textSettings = {
                ...state.textSettings,
                align: action.align,
            };

            if (state.activePlaceholder) {
                const textPlaceholder = {
                    ...state.placeholders[state.activePlaceholder],
                    align: action.align,
                };

                return {
                    ...state,
                    placeholders: {
                        ...state.placeholders,
                        [state.activePlaceholder]: textPlaceholder,
                    },
                    textSettings,
                };
            } else {
                return {
                    ...state,
                    textSettings,
                };
            }
        }
        case CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_COLOR: {
            let textSettings = {
                ...state.textSettings,
                color: action.color,
            };

            if (state.activePlaceholder) {
                const textPlaceholder = {
                    ...state.placeholders[state.activePlaceholder],
                    color: action.color,
                };

                return {
                    ...state,
                    placeholders: {
                        ...state.placeholders,
                        [state.activePlaceholder]: textPlaceholder,
                    },
                    textSettings,
                };
            } else {
                return {
                    ...state,
                    textSettings,
                };
            }
        }
        case CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_FONT_FAMILY: {
            let textSettings = {
                ...state.textSettings,
                color: action.fontFamily,
            };

            if (state.activePlaceholder) {
                const textPlaceholder = {
                    ...state.placeholders[state.activePlaceholder],
                    fontFamily: action.fontFamily,
                };

                return {
                    ...state,
                    placeholders: {
                        ...state.placeholders,
                        [state.activePlaceholder]: textPlaceholder,
                    },
                    textSettings,
                };
            } else {
                return {
                    ...state,
                    textSettings,
                };
            }
        }
        case CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_FONT_VARIANT: {
            let textSettings = {
                ...state.textSettings,
                color: action.fontVariant,
            };

            if (state.activePlaceholder) {
                const textPlaceholder = {
                    ...state.placeholders[state.activePlaceholder],
                    fontVariant: action.fontVariant,
                };

                return {
                    ...state,
                    placeholders: {
                        ...state.placeholders,
                        [state.activePlaceholder]: textPlaceholder,
                    },
                    textSettings,
                };
            } else {
                return {
                    ...state,
                    textSettings,
                };
            }
        }
        case CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_FONT_FAMILY_AND_VARIANT: {
            let textSettings = {
                ...state.textSettings,
                fontFamily: action.fontFamily,
                fontVariant: action.fontVariant,
            };

            if (state.activePlaceholder) {
                const textPlaceholder = {
                    ...state.placeholders[state.activePlaceholder],
                    fontFamily: action.fontFamily,
                    fontVariant: action.fontVariant,
                };

                return {
                    ...state,
                    placeholders: {
                        ...state.placeholders,
                        [state.activePlaceholder]: textPlaceholder,
                    },
                    textSettings,
                };
            } else {
                return {
                    ...state,
                    textSettings,
                };
            }
        }
        case CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_FONT_SIZE: {
            let textSettings = {
                ...state.textSettings,
                fontSize: action.fontSize,
            };

            if (state.activePlaceholder) {
                const textPlaceholder = {
                    ...state.placeholders[state.activePlaceholder],
                    fontSize: action.fontSize,
                };

                return {
                    ...state,
                    placeholders: {
                        ...state.placeholders,
                        [state.activePlaceholder]: textPlaceholder,
                    },
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
            let placeholdersByCard: PlaceholdersTextInfoCollection = {};
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
        case CARDSET_CHANGE_IMAGE: {
            let placeholdersByCard: PlaceholdersImageInfoCollection = {};
            if (state.images && action.cardId in state.images) {
                placeholdersByCard = { ...state.images[action.cardId] };
            }
            placeholdersByCard[action.placeholderId] = action.imageInfo;

            return {
                ...state,
                images: {
                    ...state.images,
                    [action.cardId]: placeholdersByCard,
                },
            };
        }
        case CARDSET_SET_ACTIVE_CARD_AND_PLACEHOLDER: {
            let textSettings = { ...state.textSettings };
            let activeSidebar = action.cardId !== null ? SidebarState.Details : state.activeSidebar;
            if (action.placeholderId !== null) {
                const placeholder = state.placeholders[action.placeholderId];
                if (placeholder.type === 'text') {
                    textSettings.align = placeholder.align;
                    textSettings.color = placeholder.color;
                    textSettings.fontFamily = placeholder.fontFamily;
                    textSettings.fontVariant = placeholder.fontVariant;
                    textSettings.fontSize = placeholder.fontSize;

                    activeSidebar = SidebarState.Text;
                } else {
                    activeSidebar = SidebarState.Image;
                }
            }

            return {
                ...state,
                activeCard: action.cardId,
                activePlaceholder: action.placeholderId,
                textSettings,
                activeSidebar,
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
        default:
            return state;
    }
}

export function images(state: ImageState = DefaultImageState, action: ImageListAction): ImageState {
    switch (action.type) {
        case IMAGE_LIST_REQUEST:
            return Object.assign({}, state, {
                filter: action.filter,
                activity: state.activity | ACTIVITY_LISTING,
            });
        case IMAGE_LIST_SUCCESS:
            return Object.assign({}, state, {
                activity: state.activity & ~ACTIVITY_LISTING,
                images: action.images,
            });
        case IMAGE_LIST_FAILURE:
            return Object.assign({}, state, {
                activity: state.activity & ~ACTIVITY_LISTING,
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
    images,
});

export default reducers;
