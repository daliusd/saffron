import { CancelToken } from 'axios';
import { XmlDocument, XmlNode } from 'xmldoc';
import { all, call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { delay, SagaIterator } from 'redux-saga';
import jwtDecode from 'jwt-decode';

import { BLEED_WIDTH } from './constants';
import {
    CARDSET_ADD_IMAGE_PLACEHOLDER,
    CARDSET_ADD_TEXT_PLACEHOLDER,
    CARDSET_CHANGE_ACTIVE_PLACEHOLDER_NAME,
    CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_ALIGN,
    CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_COLOR,
    CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_FONT_FAMILY,
    CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_FONT_FAMILY_AND_VARIANT,
    CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_FONT_SIZE,
    CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_FONT_VARIANT,
    CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_LINE_HEIGHT,
    CARDSET_CHANGE_FIT_FOR_ACTIVE_PLACEHOLDER,
    CARDSET_CHANGE_CROP_FOR_ACTIVE_PLACEHOLDER,
    CARDSET_CHANGE_HEIGHT,
    CARDSET_CHANGE_IMAGE,
    CARDSET_CHANGE_IS_TWO_SIDED,
    CARDSET_CHANGE_PLACEHOLDER_ANGLE,
    CARDSET_CHANGE_PLACEHOLDER_POSITION,
    CARDSET_CHANGE_PLACEHOLDER_SIZE,
    CARDSET_CHANGE_SNAPPING_DISTANCE,
    CARDSET_CHANGE_TEXT,
    CARDSET_CHANGE_WIDTH,
    CARDSET_CLONE_CARD,
    CARDSET_CREATE_CARD,
    CARDSET_CREATE_FAILURE,
    CARDSET_CREATE_REQUEST,
    CARDSET_CREATE_SUCCESS,
    CARDSET_DELETE_IMAGE,
    CARDSET_DELETE_REQUEST,
    CARDSET_IMPORT_DATA,
    CARDSET_LIST_RESET,
    CARDSET_LIST_SUCCESS,
    CARDSET_LOCK_ACTIVE_PLACEHOLDER,
    CARDSET_LOWER_ACTIVE_PLACEHOLDER_TO_BOTTOM,
    CARDSET_RAISE_ACTIVE_PLACEHOLDER_TO_TOP,
    CARDSET_REMOVE_ACTIVE_PLACEHOLDER,
    CARDSET_REMOVE_CARD,
    CARDSET_RENAME_REQUEST,
    CARDSET_SELECT_FAILURE,
    CARDSET_SELECT_REQUEST,
    CARDSET_SELECT_SUCCESS,
    CARDSET_SET_ZOOM,
    CARDSET_UNLOCK_ACTIVE_PLACEHOLDER,
    CARDSET_UPDATE_CARD_COUNT,
    CARDSET_UPDATE_DATA_FAILURE,
    CARDSET_UPDATE_DATA_REQUEST,
    CARDSET_UPDATE_DATA_SUCCESS,
    CARDSET_UPLOAD_IMAGE,
    CARDSET_UPLOAD_IMAGE_FAILURE,
    CARDSET_UPLOAD_IMAGE_SUCCESS,
    CardSetChangeFitForActivePlaceholder,
    CardSetChangeImage,
    CardSetCreateRequest,
    CardSetDeleteImage,
    CardSetDeleteRequest,
    CardSetRenameRequest,
    CardSetSelectRequest,
    CardSetUploadImage,
    GAME_CREATE_FAILURE,
    GAME_CREATE_PDF_FAILURE,
    GAME_CREATE_PDF_REQUEST,
    GAME_CREATE_PDF_SUCCESS,
    GAME_CREATE_PNG_FAILURE,
    GAME_CREATE_PNG_REQUEST,
    GAME_CREATE_PNG_SUCCESS,
    GAME_CREATE_REQUEST,
    GAME_CREATE_SUCCESS,
    GAME_DELETE_REQUEST,
    GAME_LIST_FAILURE,
    GAME_LIST_REQUEST,
    GAME_LIST_RESET,
    GAME_LIST_SUCCESS,
    GAME_RENAME_REQUEST,
    GAME_SELECT_FAILURE,
    GAME_SELECT_REQUEST,
    GAME_SELECT_SUCCESS,
    GameCreatePdfRequest,
    GameCreatePngRequest,
    GameCreateRequest,
    GameDeleteRequest,
    GameRenameRequest,
    GameSelectRequest,
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
    MessageDisplay,
    SIGNUP_FAILURE,
    SIGNUP_REQUEST,
    SIGNUP_SUCCESS,
    SignUpRequest,
    cardSetChangeImageBase64,
    gameSelectRequest,
    messageDisplay,
    CARDSET_CHANGE_PLACEHOLDER_PAN,
    CARDSET_CHANGE_PLACEHOLDER_ZOOM,
} from './actions';
import { CardSetType, CardSetsCollection, GameType, GamesCollection } from './types';
import { State } from './reducers';
import {
    deleteAccessToken,
    deleteRefreshToken,
    deleteRequest,
    getRequest,
    getTokens,
    postRequest,
    postRequestFormDataCancelable,
    putRequest,
    refreshToken,
    registerUser,
} from './requests';
import { generatePdfUsingWorker, generatePngUsingWorker } from './workerController';
import { getTokenFromStorage, getRefreshTokenFromStorage, saveAccessToken, saveTokens, cleanTokens } from './storage';
import { loadFontsUsedInPlaceholders } from './fontLoader';

// Messages
export function* putError(message: string): SagaIterator {
    yield put(messageDisplay('error', message));
}

export function* putInfo(message: string): SagaIterator {
    yield put(messageDisplay('info', message));
}

export function* putProgress(text: string): SagaIterator {
    const message = messageDisplay('progress', text, text);
    yield put(message);
    return message.message.id;
}

export function* hideProgress(messageId: string): SagaIterator {
    yield put({ type: MESSAGE_HIDE, messageId });
}

export function* handleMessageDisplay(action: MessageDisplay): SagaIterator {
    if (action.message.type === 'progress') return;

    yield call(delay, 5000);
    yield put({ type: MESSAGE_HIDE, messageId: action.message.id });
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

export function* getToken(withErrorIfMissing: boolean, getFreshToken = false): SagaIterator {
    const token = yield call(getTokenFromStorage);
    if (token && !getFreshToken) {
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

export function* authorizedDeleteRequest(url: string): SagaIterator {
    const token = yield call(getToken, true);
    return yield call(deleteRequest, url, token);
}

export function* authorizedPostFormDataRequest(
    url: string,
    data: FormData,
    progressCallback: (event: ProgressEvent) => void,
    cancelToken: CancelToken,
    cancelCallback: () => void,
): SagaIterator {
    const token = yield call(getToken, true);
    return yield call(postRequestFormDataCancelable, url, token, data, progressCallback, cancelToken, cancelCallback);
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

export function* handleGameDeleteRequest(action: GameDeleteRequest): SagaIterator {
    try {
        yield call(authorizedDeleteRequest, '/api/games/' + action.gameId);
        yield put({ type: GAME_LIST_REQUEST });
    } catch (e) {
        yield call(putError, e.message);
    }
}

export function* handleGameRenameRequest(action: GameRenameRequest): SagaIterator {
    try {
        yield call(delay, 500);
        yield call(authorizedPutRequest, '/api/games/' + action.gameId, { name: action.newName });
    } catch (e) {
        yield call(putError, e.message);
    }
}

export function* handleGameListRequest(): SagaIterator {
    try {
        const resp = yield call(authorizedGetRequest, '/api/games');
        const allIds = resp.data.games.map((g: GameType) => g.id);
        const byId = resp.data.games.reduce((obj: GamesCollection, g: GameType) => {
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
        const resp = yield call(authorizedGetRequest, '/api/games/' + action.id);
        yield put({
            type: GAME_SELECT_SUCCESS,
            id: action.id,
        });

        if (action.updateCardSets) {
            const allIds = resp.data.cardsets.map((g: CardSetType) => g.id);
            const byId = resp.data.cardsets.reduce((obj: CardSetsCollection, g: CardSetType) => {
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
    let progressId = null;
    try {
        progressId = yield call(putProgress, 'Generating PDF');

        const token = yield call(getToken, true, true);

        yield call(
            generatePdfUsingWorker,
            token,
            action.collectionType,
            action.collectionId,
            action.pageWidth,
            action.pageHeight,
            action.topBottomMargin,
            action.leftRightMargin,
            action.verticalSpace,
            action.horizontalSpace,
            action.includeBleedingArea,
            action.cutMarksForScissors,
            action.cutMarksForGuillotine,
            action.cutMarksInMarginArea,
            action.cutMarksOnFrontSideOnly,
        );
        yield call(hideProgress, progressId);
        yield call(putInfo, 'PDF generated.');
        yield put({
            type: GAME_CREATE_PDF_SUCCESS,
        });
    } catch (e) {
        yield put({ type: GAME_CREATE_PDF_FAILURE });
        if (progressId !== null) yield call(hideProgress, progressId);
        yield call(putError, e.message);
    }
}

export function* handleGameCreatePngRequest(action: GameCreatePngRequest): SagaIterator {
    let progressId = null;
    try {
        progressId = yield call(putProgress, 'Generating PNG');

        const token = yield call(getToken, true, true);

        yield call(generatePngUsingWorker, token, action.collectionType, action.collectionId, action.dpi);
        yield call(hideProgress, progressId);
        yield call(putInfo, 'PNG generated.');
        yield put({
            type: GAME_CREATE_PNG_SUCCESS,
        });
    } catch (e) {
        yield put({ type: GAME_CREATE_PNG_FAILURE });
        if (progressId !== null) yield call(hideProgress, progressId);
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

export function* handleCardSetDeleteRequest(action: CardSetDeleteRequest): SagaIterator {
    try {
        yield call(authorizedDeleteRequest, '/api/cardsets/' + action.cardSetId);
        yield put({ type: GAME_LIST_REQUEST });

        const state = yield select();
        yield put(gameSelectRequest(state.games.active, true));
    } catch (e) {
        yield call(putError, e.message);
    }
}

export function* handleCardSetRenameRequest(action: CardSetRenameRequest): SagaIterator {
    try {
        yield call(delay, 500);
        yield call(authorizedPutRequest, '/api/cardsets/' + action.cardSetId, { name: action.newName });
    } catch (e) {
        yield call(putError, e.message);
    }
}

export function* handleCardSetSelectRequest(action: CardSetSelectRequest): SagaIterator {
    try {
        const resp = yield call(authorizedGetRequest, '/api/cardsets/' + action.id);
        const parsedData = JSON.parse(resp.data.data);
        if (!('placeholdersAllIds' in parsedData) && 'placeholders' in parsedData) {
            parsedData.placeholdersAllIds = Object.keys(parsedData.placeholders);
        }

        if (!('version' in parsedData)) {
            parsedData.version = 2;
            for (const plId in parsedData.placeholders) {
                const placeholder = parsedData.placeholders[plId];
                placeholder.x += BLEED_WIDTH;
                placeholder.y += BLEED_WIDTH;
            }
        }

        yield call(loadFontsUsedInPlaceholders, parsedData);
        yield put({
            type: CARDSET_SELECT_SUCCESS,
            id: resp.data.id,
            name: resp.data.name,
            data: parsedData,
        });
        yield put(gameSelectRequest(resp.data.gameId, false));
    } catch (e) {
        yield put({ type: CARDSET_SELECT_FAILURE });
        yield call(putError, e.message);
    }
}

export function* handleCardSetUploadImage(action: CardSetUploadImage): SagaIterator {
    let progressId = null;
    try {
        progressId = yield call(putProgress, `Uploading ${action.file.name}`);
        const formData = new FormData();
        formData.set('gameId', action.gameId);
        formData.append('image', action.file, action.file.name);

        const data = yield call(
            authorizedPostFormDataRequest,
            '/api/images',
            formData,
            (event: ProgressEvent) => action.progress(event.lengthComputable, event.loaded, event.total),
            action.cancelToken,
            () => {
                action.abort();
            },
        );
        if (data !== undefined) {
            // not cancelled
            action.load(data.imageId.toString());
            yield put({ type: CARDSET_UPLOAD_IMAGE_SUCCESS });
            yield call(putInfo, `${action.file.name} uploaded`);
        }
        yield call(hideProgress, progressId);
    } catch (e) {
        yield put({ type: CARDSET_UPLOAD_IMAGE_FAILURE });
        if (progressId !== null) yield call(hideProgress, progressId);
        yield call(putError, e.message);
        action.error(e.message);
    }
}

export function* handleCardSetDeleteImage(action: CardSetDeleteImage): SagaIterator {
    try {
        yield call(authorizedDeleteRequest, '/api/images/' + action.imageId);
        action.load();
    } catch (e) {
        action.error(e.message);
    }
}

function walkChildren(node: XmlNode, color: string) {
    if (node.type === 'element') {
        for (let child of node.children) {
            if (child.type === 'element')
                if (child.name === 'path') {
                    child.attr['fill'] = color;
                }
            walkChildren(child, color);
        }
    }
}

function adjustSvg(data: string, preserveAspectRatio: boolean, color?: string): string {
    const doc = new XmlDocument(data);
    if (!preserveAspectRatio) {
        doc.attr['preserveAspectRatio'] = 'none';
    }

    if (color) {
        walkChildren(doc, color);
    }

    return btoa(doc.toString({ compressed: true }));
}

export function* handleCardSetFitChange(action: CardSetChangeFitForActivePlaceholder): SagaIterator {
    try {
        yield call(delay, 100);
        const state: State = yield select();

        if (state.cardsets.activePlaceholder === null) {
            return;
        }

        for (const cardId in state.cardsets.cardsById) {
            const image = state.cardsets.images[cardId][state.cardsets.activePlaceholder];
            if (image.url) {
                const imageResp = yield call(authorizedGetRequest, image.url);
                if (imageResp.headers['content-type'] === 'image/svg+xml') {
                    if (action.fit === 'stretch') {
                        const svg = adjustSvg(imageResp.data, false, image.color);
                        yield put(cardSetChangeImageBase64(cardId, state.cardsets.activePlaceholder, svg));
                    } else if (image.color) {
                        const svg = adjustSvg(imageResp.data, true, image.color);
                        yield put(cardSetChangeImageBase64(cardId, state.cardsets.activePlaceholder, svg));
                    } else {
                        yield put(cardSetChangeImageBase64(cardId, state.cardsets.activePlaceholder, undefined));
                    }
                }
            }
        }
    } catch (e) {
        yield call(putError, e.message);
    }
}

export function* handleCardSetChangeImage(action: CardSetChangeImage): SagaIterator {
    try {
        yield call(delay, 100);
        const state: State = yield select();

        const placeholder = state.cardsets.placeholders[action.placeholderId];
        const imageInfo = state.cardsets.images[action.cardId][action.placeholderId];
        if (placeholder.type === 'image' && imageInfo.url) {
            const imageResp = yield call(authorizedGetRequest, imageInfo.url);

            if (imageResp.headers['content-type'] === 'image/svg+xml') {
                const name = placeholder.name || placeholder.id;

                for (const plId in state.cardsets.placeholders) {
                    const pl = state.cardsets.placeholders[plId];

                    if ((pl.name === name || pl.id === name) && pl.type === 'image') {
                        if (pl.fit === 'stretch') {
                            const svg = adjustSvg(imageResp.data, false, imageInfo.color);
                            yield put(cardSetChangeImageBase64(action.cardId, plId, svg));
                        } else if (imageInfo.color) {
                            const svg = adjustSvg(imageResp.data, true, imageInfo.color);
                            yield put(cardSetChangeImageBase64(action.cardId, plId, svg));
                        } else {
                            yield put(cardSetChangeImageBase64(action.cardId, plId, undefined));
                        }
                    }
                }
            }
        }
    } catch (e) {
        yield call(putError, e.message);
    }
}

function closeHandler(e: Event) {
    e.preventDefault();
    e.returnValue = true;
}

function preventWindowClose() {
    window.addEventListener('beforeunload', closeHandler);
}

function allowWindowClose() {
    window.removeEventListener('beforeunload', closeHandler);
}

export function* handleCardSetChange(): SagaIterator {
    let progressId = null;

    try {
        preventWindowClose();
        progressId = yield call(putProgress, 'Saving Card Set');

        yield call(delay, 1000);
        const state = yield select();

        yield put({
            type: CARDSET_UPDATE_DATA_REQUEST,
        });

        const cardsetId = state.cardsets.active;
        const data = {
            width: state.cardsets.width,
            height: state.cardsets.height,
            isTwoSided: state.cardsets.isTwoSided,
            snappingDistance: state.cardsets.snappingDistance,
            version: state.cardsets.version,
            cardsAllIds: state.cardsets.cardsAllIds,
            cardsById: state.cardsets.cardsById,
            placeholdersAllIds: state.cardsets.placeholdersAllIds,
            placeholders: state.cardsets.placeholders,
            texts: state.cardsets.texts,
            images: state.cardsets.images,
            zoom: state.cardsets.zoom,
        };

        yield call(authorizedPutRequest, '/api/cardsets/' + cardsetId, {
            name: state.cardsets.byId[cardsetId].name,
            data: JSON.stringify(data),
        });
        yield call(hideProgress, progressId);
        yield call(putInfo, 'Card Set saved');
        yield put({
            type: CARDSET_UPDATE_DATA_SUCCESS,
        });
        allowWindowClose();
    } catch (e) {
        yield put({ type: CARDSET_UPDATE_DATA_FAILURE });
        if (progressId !== null) yield call(hideProgress, progressId);
        yield call(putError, e.message);
        allowWindowClose();
    }
}

// Images
export function* handleImageListRequest(action: ImageListRequest): SagaIterator {
    try {
        yield call(delay, 200);
        const state = yield select();

        const filter = encodeURIComponent(action.filter);
        const location = encodeURIComponent(action.location);
        const game = encodeURIComponent(state.games.active);
        const resp = yield call(authorizedGetRequest, `/api/images?name=${filter}&location=${location}&game=${game}`);
        const images = resp.data.images;
        yield put({
            type: IMAGE_LIST_SUCCESS,
            images,
        });
    } catch (e) {
        yield put({ type: IMAGE_LIST_FAILURE });
        yield call(putError, e.message);
    }
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
        takeLatest(GAME_DELETE_REQUEST, handleGameDeleteRequest),
        takeLatest(GAME_RENAME_REQUEST, handleGameRenameRequest),
        takeLatest(GAME_LIST_REQUEST, handleGameListRequest),
        takeLatest(GAME_SELECT_REQUEST, handleGameSelectRequest),
        takeLatest(GAME_CREATE_PDF_REQUEST, handleGameCreatePdfRequest),
        takeLatest(GAME_CREATE_PNG_REQUEST, handleGameCreatePngRequest),
        takeLatest(CARDSET_CREATE_REQUEST, handleCardSetCreateRequest),
        takeLatest(CARDSET_DELETE_REQUEST, handleCardSetDeleteRequest),
        takeLatest(CARDSET_RENAME_REQUEST, handleCardSetRenameRequest),
        takeLatest(CARDSET_SELECT_REQUEST, handleCardSetSelectRequest),
        takeEvery(CARDSET_UPLOAD_IMAGE, handleCardSetUploadImage),
        takeEvery(CARDSET_DELETE_IMAGE, handleCardSetDeleteImage),
        takeEvery(CARDSET_CHANGE_FIT_FOR_ACTIVE_PLACEHOLDER, handleCardSetFitChange),
        takeEvery(CARDSET_CHANGE_IMAGE, handleCardSetChangeImage),

        takeLatest(CARDSET_CREATE_CARD, handleCardSetChange),
        takeLatest(CARDSET_CLONE_CARD, handleCardSetChange),
        takeLatest(CARDSET_REMOVE_CARD, handleCardSetChange),
        takeLatest(CARDSET_UPDATE_CARD_COUNT, handleCardSetChange),
        takeLatest(CARDSET_ADD_TEXT_PLACEHOLDER, handleCardSetChange),
        takeLatest(CARDSET_ADD_IMAGE_PLACEHOLDER, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_ACTIVE_PLACEHOLDER_NAME, handleCardSetChange),
        takeLatest(CARDSET_REMOVE_ACTIVE_PLACEHOLDER, handleCardSetChange),
        takeLatest(CARDSET_RAISE_ACTIVE_PLACEHOLDER_TO_TOP, handleCardSetChange),
        takeLatest(CARDSET_LOWER_ACTIVE_PLACEHOLDER_TO_BOTTOM, handleCardSetChange),
        takeLatest(CARDSET_LOCK_ACTIVE_PLACEHOLDER, handleCardSetChange),
        takeLatest(CARDSET_UNLOCK_ACTIVE_PLACEHOLDER, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_FIT_FOR_ACTIVE_PLACEHOLDER, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_CROP_FOR_ACTIVE_PLACEHOLDER, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_WIDTH, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_HEIGHT, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_IS_TWO_SIDED, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_SNAPPING_DISTANCE, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_PLACEHOLDER_POSITION, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_PLACEHOLDER_PAN, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_PLACEHOLDER_ZOOM, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_PLACEHOLDER_SIZE, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_PLACEHOLDER_ANGLE, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_ALIGN, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_COLOR, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_FONT_FAMILY, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_FONT_VARIANT, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_FONT_FAMILY_AND_VARIANT, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_FONT_SIZE, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_LINE_HEIGHT, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_TEXT, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_IMAGE, handleCardSetChange),
        takeLatest(CARDSET_SET_ZOOM, handleCardSetChange),
        takeLatest(CARDSET_IMPORT_DATA, handleCardSetChange),

        takeLatest(IMAGE_LIST_REQUEST, handleImageListRequest),

        takeLatest(INIT_REQUEST, handleInitRequest),
    ]);
}
