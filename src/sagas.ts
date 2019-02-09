import { all, call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { delay, SagaIterator } from 'redux-saga';
import jwtDecode from 'jwt-decode';

import {
    Action,
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
    CARDSET_LIST_RESET,
    CARDSET_LIST_SUCCESS,
    CARDSET_REMOVE_ACTIVE_PLACEHOLDER,
    CARDSET_REMOVE_CARD,
    CARDSET_SELECT_FAILURE,
    CARDSET_SELECT_REQUEST,
    CARDSET_SELECT_SUCCESS,
    CARDSET_UPDATE_CARD_COUNT,
    CARDSET_UPDATE_DATA_FAILURE,
    CARDSET_UPDATE_DATA_SUCCESS,
    CardSetCreateRequest,
    CardSetSelectRequest,
    CardSetType,
    CardSetsCollection,
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
    GameCreatePdfRequest,
    GameCreateRequest,
    GameSelectRequest,
    GameType,
    GamesCollection,
    IMAGE_LIST_FAILURE,
    IMAGE_LIST_REQUEST,
    IMAGE_LIST_SUCCESS,
    INIT_REQUEST,
    ImageListRequest,
    LOGIN_FAILURE,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGOUT_FAILURE,
    LOGOUT_REQUEST,
    LOGOUT_SUCCESS,
    LoginRequest,
    MESSAGE_DISPLAY,
    MESSAGE_HIDE,
    MessageAction,
    SIGNUP_FAILURE,
    SIGNUP_REQUEST,
    SIGNUP_SUCCESS,
    SignUpRequest,
    gameSelectRequest,
    messageRequest,
} from './actions';
import {
    deleteAccessToken,
    deleteRefreshToken,
    getRequest,
    getTokens,
    postRequest,
    putRequest,
    refreshToken,
    registerUser,
} from './requests';
import { generatePdfUsingWorker } from './workerController';
import { getTokenFromStorage, getRefreshTokenFromStorage, saveAccessToken, saveTokens, cleanTokens } from './storage';
import { loadFontsUsedInPlaceholders } from './fontLoader';

// Messages
export function* putError(message: string): SagaIterator {
    yield put(messageRequest('error', message));
}

export function* handleMessageDisplay(action: MessageAction): SagaIterator {
    yield call(delay, 5000);
    yield put({ type: MESSAGE_HIDE, message: action.message });
}

// Login & Signup
// Token handling

export function validateToken(token: string): boolean {
    try {
        const decoded = jwtDecode<{ exp: number }>(token);
        const valid = decoded.exp - new Date().getTime() / 1000 > 5;
        return valid;
    } catch (e) {
        return false;
    }
}

export function* getToken(withErrorIfMissing: boolean): SagaIterator {
    const token = yield call(getTokenFromStorage);
    if (token) {
        const tokenValid = yield call(validateToken, token);
        if (tokenValid) return token;
    }

    const refreshTokenValue = yield call(getRefreshTokenFromStorage);
    if (!refreshTokenValue) {
        if (withErrorIfMissing) throw new Error('Token not found.');
        return null;
    }

    const refreshTokenValid = yield call(validateToken, refreshTokenValue);
    if (!refreshTokenValid) {
        yield put({ type: LOGOUT_REQUEST });
        if (withErrorIfMissing) throw new Error('Token not found.');
        return null;
    }

    const newToken = yield call(refreshToken, refreshTokenValue);
    yield call(saveAccessToken, newToken);
    return newToken;
}

// Login

export function* handleLoginRequest(action: LoginRequest): SagaIterator {
    try {
        const data = yield call(getTokens, action.creds);
        yield call(saveTokens, data);
        yield put({ type: LOGIN_SUCCESS });
    } catch (e) {
        yield put({ type: LOGIN_FAILURE });
        yield call(putError, e.message);
    }
}

export function* handleLoginSuccess(): SagaIterator {
    yield put({ type: GAME_LIST_REQUEST });
}

// Logout

export function* logoutToken(): SagaIterator {
    const token = yield call(getTokenFromStorage);
    if (token) {
        const tokenValid = yield call(validateToken, token);
        if (tokenValid) {
            yield call(deleteAccessToken, token);
        }
    }
}

export function* logoutRefreshToken(): SagaIterator {
    const refreshTokenValue = yield call(getRefreshTokenFromStorage);
    if (refreshTokenValue) {
        const refreshTokenValid = yield call(validateToken, refreshTokenValue);
        if (refreshTokenValid) {
            yield call(deleteRefreshToken, refreshTokenValue);
        }
    }
}

export function* handleLogoutRequest(): SagaIterator {
    try {
        yield call(logoutToken);
        yield call(logoutRefreshToken);
        yield call(cleanTokens);

        yield put({ type: CARDSET_LIST_RESET });
        yield put({ type: GAME_LIST_RESET });
        yield put({ type: LOGOUT_SUCCESS });
    } catch (e) {
        yield put({ type: LOGOUT_FAILURE });
        yield call(putError, e.message);
    }
}

// Sign-up

export function* handleSignupRequest(action: SignUpRequest): SagaIterator {
    try {
        const data = yield call(registerUser, action.creds);
        yield call(saveTokens, data);
        yield put({ type: SIGNUP_SUCCESS });
        yield put({ type: LOGIN_SUCCESS });
    } catch (e) {
        yield put({ type: SIGNUP_FAILURE });
        yield call(putError, e.message);
    }
}

// Init
export function* handleInitRequest(): SagaIterator {
    try {
        let token = yield call(getToken, false);
        if (token) {
            yield put({ type: LOGIN_SUCCESS });
        }
    } catch (e) {}
}

// Authorized Requests
export function* authorizedGetRequest(url: string): SagaIterator {
    const token = yield call(getToken, true);
    return yield call(getRequest, url, token);
}

export function* authorizedPostRequest(url: string, data: object): SagaIterator {
    const token = yield call(getToken, true);
    return yield call(postRequest, url, token, data);
}

export function* authorizedPutRequest(url: string, data: object): SagaIterator {
    const token = yield call(getToken, true);
    return yield call(putRequest, url, token, data);
}

// Game
export function* handleGameCreateRequest(action: GameCreateRequest): SagaIterator {
    try {
        yield call(authorizedPostRequest, '/api/games', { name: action.gamename });
        yield put({
            type: GAME_CREATE_SUCCESS,
        });
        yield put({ type: GAME_LIST_REQUEST });
    } catch (e) {
        yield put({ type: GAME_CREATE_FAILURE });
        yield call(putError, e.message);
    }
}

export function* handleGameListRequest(): SagaIterator {
    try {
        const data = yield call(authorizedGetRequest, '/api/games');
        const allIds = data.games.map((g: GameType) => g.id);
        const byId = data.games.reduce((obj: GamesCollection, g: GameType) => {
            obj[g.id] = g;
            return obj;
        }, {});
        yield put({
            type: GAME_LIST_SUCCESS,
            allIds,
            byId,
        });
    } catch (e) {
        yield put({ type: GAME_LIST_FAILURE });
        yield call(putError, e.message);
    }
}

export function* handleGameSelectRequest(action: GameSelectRequest): SagaIterator {
    try {
        const data = yield call(authorizedGetRequest, '/api/games/' + action.id);
        yield put({
            type: GAME_SELECT_SUCCESS,
            id: action.id,
        });

        if (action.updateCardSets) {
            const allIds = data.cardsets.map((g: CardSetType) => g.id);
            const byId = data.cardsets.reduce((obj: CardSetsCollection, g: CardSetType) => {
                obj[g.id] = g;
                return obj;
            }, {});
            yield put({
                type: CARDSET_LIST_SUCCESS,
                allIds,
                byId,
            });
        }
    } catch (e) {
        yield put({ type: GAME_SELECT_FAILURE });
        yield call(putError, e.message);
    }
}

export function* handleGameCreatePdfRequest(action: GameCreatePdfRequest): SagaIterator {
    try {
        const state = yield select();

        yield call(
            generatePdfUsingWorker,
            state.cardsets.placeholders,
            state.cardsets.texts,
            state.cardsets.images,
            action.pageWidth,
            action.pageHeight,
            action.topBottomMargin,
            action.leftRightMargin,
        );
        yield put({
            type: GAME_CREATE_PDF_SUCCESS,
        });
    } catch (e) {
        yield put({ type: GAME_CREATE_PDF_FAILURE });
        yield call(putError, e.message);
    }
}

// Card Set

export function* handleCardSetCreateRequest(action: CardSetCreateRequest): SagaIterator {
    try {
        yield call(authorizedPostRequest, '/api/cardsets', {
            name: action.cardsetname,
            gameId: action.gameId,
            data: JSON.stringify({ width: action.width, height: action.height }),
        });
        yield put({
            type: CARDSET_CREATE_SUCCESS,
        });
        yield put(gameSelectRequest(action.gameId, true));
    } catch (e) {
        yield put({ type: CARDSET_CREATE_FAILURE });
        yield call(putError, e.message);
    }
}

export function* handleCardSetSelectRequest(action: CardSetSelectRequest): SagaIterator {
    try {
        const data = yield call(authorizedGetRequest, '/api/cardsets/' + action.id);
        const parsedData = JSON.parse(data.data);
        yield call(loadFontsUsedInPlaceholders, parsedData);
        yield put({
            type: CARDSET_SELECT_SUCCESS,
            id: data.id,
            name: data.name,
            data: parsedData,
        });
        yield put(gameSelectRequest(data.gameId, false));
    } catch (e) {
        yield put({ type: CARDSET_SELECT_FAILURE });
        yield call(putError, e.message);
    }
}

export function* handleCardSetChange(): SagaIterator {
    try {
        yield call(delay, 1000);
        const state = yield select();

        const cardsetId = state.cardsets.active;
        const data = {
            width: state.cardsets.width,
            height: state.cardsets.height,
            cardsAllIds: state.cardsets.cardsAllIds,
            cardsById: state.cardsets.cardsById,
            placeholders: state.cardsets.placeholders,
            texts: state.cardsets.texts,
            images: state.cardsets.images,
        };

        yield call(authorizedPutRequest, '/api/cardsets/' + cardsetId, {
            name: state.cardsets.byId[cardsetId].name,
            data: JSON.stringify(data),
        });
        yield put({
            type: CARDSET_UPDATE_DATA_SUCCESS,
        });
    } catch (e) {
        yield put({ type: CARDSET_UPDATE_DATA_FAILURE });
        yield call(putError, e.message);
    }
}

// Images
export function* handleImageListRequest(action: ImageListRequest): SagaIterator {
    try {
        yield call(delay, 200);
        const data = yield call(authorizedGetRequest, '/api/images?name=' + action.filter);
        const images = data.images;
        yield put({
            type: IMAGE_LIST_SUCCESS,
            images,
        });
    } catch (e) {
        yield put({ type: IMAGE_LIST_FAILURE });
        yield call(putError, e.message);
    }
}

// Logger
function* handleEverything(action: Action) {
    const state = yield select();

    console.log('action', action);
    console.log('state after', state);
}

// All
export function* rootSaga(): SagaIterator {
    yield all([
        takeEvery(MESSAGE_DISPLAY, handleMessageDisplay),
        takeLatest(LOGIN_REQUEST, handleLoginRequest),
        takeLatest(LOGIN_SUCCESS, handleLoginSuccess),
        takeLatest(LOGOUT_REQUEST, handleLogoutRequest),
        takeLatest(SIGNUP_REQUEST, handleSignupRequest),
        takeLatest(GAME_CREATE_REQUEST, handleGameCreateRequest),
        takeLatest(GAME_LIST_REQUEST, handleGameListRequest),
        takeLatest(GAME_SELECT_REQUEST, handleGameSelectRequest),
        takeLatest(GAME_CREATE_PDF_REQUEST, handleGameCreatePdfRequest),
        takeLatest(CARDSET_CREATE_REQUEST, handleCardSetCreateRequest),
        takeLatest(CARDSET_SELECT_REQUEST, handleCardSetSelectRequest),

        takeLatest(CARDSET_CREATE_CARD, handleCardSetChange),
        takeLatest(CARDSET_CLONE_CARD, handleCardSetChange),
        takeLatest(CARDSET_REMOVE_CARD, handleCardSetChange),
        takeLatest(CARDSET_UPDATE_CARD_COUNT, handleCardSetChange),
        takeLatest(CARDSET_ADD_TEXT_PLACEHOLDER, handleCardSetChange),
        takeLatest(CARDSET_ADD_IMAGE_PLACEHOLDER, handleCardSetChange),
        takeLatest(CARDSET_REMOVE_ACTIVE_PLACEHOLDER, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_WIDTH, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_HEIGHT, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_PLACEHOLDER_POSITION, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_PLACEHOLDER_SIZE, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_PLACEHOLDER_ANGLE, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_ALIGN, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_COLOR, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_FONT_FAMILY, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_FONT_VARIANT, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_FONT_FAMILY_AND_VARIANT, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_FONT_SIZE, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_TEXT, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_IMAGE, handleCardSetChange),

        takeLatest(IMAGE_LIST_REQUEST, handleImageListRequest),

        takeLatest(INIT_REQUEST, handleInitRequest),
        takeEvery('*', handleEverything),
    ]);
}
