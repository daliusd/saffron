import { CancelToken } from 'axios';
import { XmlDocument, XmlNode } from 'xmldoc';
import { all, call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { delay } from 'redux-saga/effects';
import jwtDecode from 'jwt-decode';
import { ActionCreators } from 'redux-undo';

import { BLEED_WIDTH, CURRENT_CARDSET_VERSION } from './constants';
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
    CARDSET_CHANGE_IS_TWO_SIDED,
    CARDSET_CHANGE_FIELD_ANGLE,
    CARDSET_CHANGE_FIELD_SIZE,
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
    CARDSET_LOCK_ACTIVE_FIELD,
    CARDSET_LOWER_ACTIVE_FIELD,
    CARDSET_LOWER_ACTIVE_FIELD_TO_BOTTOM,
    CARDSET_RAISE_ACTIVE_FIELD,
    CARDSET_RAISE_ACTIVE_FIELD_TO_TOP,
    CARDSET_REMOVE_ACTIVE_FIELD,
    CARDSET_REMOVE_CARD,
    CARDSET_RENAME_REQUEST,
    CARDSET_SELECT_FAILURE,
    CARDSET_SELECT_REQUEST,
    CARDSET_SELECT_SUCCESS,
    CARDSET_SET_ZOOM,
    CARDSET_UNLOCK_ACTIVE_FIELD,
    CARDSET_UPDATE_CARD_COUNT,
    CARDSET_UPLOAD_IMAGE,
    CARDSET_UPLOAD_IMAGE_FAILURE,
    CARDSET_UPLOAD_IMAGE_SUCCESS,
    CardSetChangeFitForActiveField,
    CardSetChangeImage,
    CardSetCreateRequest,
    CardSetDeleteImage,
    CardSetDeleteRequest,
    CardSetRenameRequest,
    CardSetSelectRequest,
    CardSetUploadImage,
    GAME_CREATE_PDF_FAILURE,
    GAME_CREATE_PDF_REQUEST,
    GAME_CREATE_PDF_SUCCESS,
    GAME_CREATE_PNG_FAILURE,
    GAME_CREATE_PNG_REQUEST,
    GAME_GET_ATTRIBUTIONS_REQUEST,
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
    CARDSET_CHANGE_FIELD_PAN,
    CARDSET_CHANGE_FIELD_ZOOM,
    CARDSETS_SELECT_SUCCESS,
    CARDSET_CHANGE_FIELD_POSITION,
    CardSetSelectSuccessData,
    CardSetSelectSuccessDataV2,
    CardSetSelectSuccessDataV3,
    CARDSET_UNDO,
    CARDSET_REDO,
    CARDSET_CHANGE_UNCLICKABLE_FOR_ACTIVE_FIELD,
    CARDSET_ROTATE_CARDS_RIGHT,
    CARDSET_ROTATE_CARDS_LEFT,
    GAME_GET_ATTRIBUTIONS_SUCCESS,
    GAME_GET_ATTRIBUTIONS_FAILURE,
} from './actions';
import { CardSetType, CardSetsCollection, GameType, GamesCollection, FieldInfoByCardCollection } from './types';
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
import { generatePdfUsingWorker, generatePngUsingWorker, retrieveGameAttributions } from './workerController';
import {
    getTokenFromStorage,
    getRefreshTokenFromStorage,
    saveAccessToken,
    saveTokens,
    cleanTokens,
    saveUsername,
    getUsernameFromStorage,
} from './storage';
import { loadFontsUsedInPlaceholders } from './fontLoader';
import { reportError, UserError } from './utils';

// Messages
export function* putError(e: Error): SagaIterator {
    yield put(messageDisplay('error', e.message));
    yield call(reportError, e);
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

    yield delay(5000);
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
        yield put({ type: LOGOUT_REQUEST });
        if (withErrorIfMissing) {
            throw new UserError('User not logged in.');
        }
        return null;
    }

    const refreshTokenValid = yield call(validateToken, refreshTokenValue);
    if (!refreshTokenValid) {
        yield put({ type: LOGOUT_REQUEST });
        if (withErrorIfMissing) {
            throw new UserError('User not logged in.');
        }
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
        yield call(saveUsername, action.creds.username);
        yield put({ type: LOGIN_SUCCESS, username: action.creds.username });
    } catch (e) {
        yield put({ type: LOGIN_FAILURE });
        yield call(putError, e);
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
        yield call(putError, e);
    }
}

// Sign-up

export function* handleSignupRequest(action: SignUpRequest): SagaIterator {
    try {
        const data = yield call(registerUser, action.creds);
        yield call(saveTokens, data);
        yield call(saveUsername, action.creds.username);
        yield put({ type: SIGNUP_SUCCESS });
        yield put({ type: LOGIN_SUCCESS, username: action.creds.username });
    } catch (e) {
        yield put({ type: SIGNUP_FAILURE });
        yield call(putError, e);
    }
}

// Init
export function* handleInitRequest(): SagaIterator {
    try {
        const token = yield call(getToken, false);
        if (token) {
            const username = yield call(getUsernameFromStorage);
            yield put({ type: LOGIN_SUCCESS, username });
        }
    } catch (e) {}
}

// Authorized Requests
export function* authorizedGetRequest(url: string): SagaIterator {
    const token = yield call(getToken, true);
    return yield call(getRequest, url, token);
}

export function* authorizedPostRequest(url: string, data: any): SagaIterator {
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

export function* authorizedPutRequest(url: string, data: any): SagaIterator {
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
        yield call(putError, e);
    }
}

export function* handleGameDeleteRequest(action: GameDeleteRequest): SagaIterator {
    try {
        yield call(authorizedDeleteRequest, '/api/games/' + action.gameId);
        yield put({ type: GAME_LIST_REQUEST });
    } catch (e) {
        yield call(putError, e);
    }
}

export function* handleGameRenameRequest(action: GameRenameRequest): SagaIterator {
    try {
        yield delay(500);
        yield call(authorizedPutRequest, '/api/games/' + action.gameId, { name: action.newName });
    } catch (e) {
        yield call(putError, e);
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
        yield call(putError, e);
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
        yield call(putError, e);
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
        yield call(putError, e);
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
        yield call(putError, e);
    }
}

export function* handleGameGetAttributionsRequest(): SagaIterator {
    let progressId = null;
    try {
        progressId = yield call(putProgress, 'Retrieving attributions');

        const token = yield call(getToken, true, true);
        const state: State = yield select();

        let attributions = [];
        if (state.games.active !== null) {
            attributions = yield call(retrieveGameAttributions, token, state.games.active);
        }
        yield call(hideProgress, progressId);
        yield call(putInfo, 'Attributions retrieved.');
        yield put({
            type: GAME_GET_ATTRIBUTIONS_SUCCESS,
            attributions,
        });
    } catch (e) {
        yield put({ type: GAME_GET_ATTRIBUTIONS_FAILURE });
        if (progressId !== null) yield call(hideProgress, progressId);
        yield call(putError, e);
    }
}

// Card Set

export function* handleCardSetCreateRequest(action: CardSetCreateRequest): SagaIterator {
    try {
        yield call(authorizedPostRequest, '/api/cardsets', {
            name: action.cardsetname,
            gameId: action.gameId,
            data: JSON.stringify({ width: action.width, height: action.height, version: CURRENT_CARDSET_VERSION }),
        });
        yield put({
            type: CARDSET_CREATE_SUCCESS,
        });
        yield put(gameSelectRequest(action.gameId, true));
    } catch (e) {
        yield put({ type: CARDSET_CREATE_FAILURE });
        yield call(putError, e);
    }
}

export function* handleCardSetDeleteRequest(action: CardSetDeleteRequest): SagaIterator {
    try {
        yield call(authorizedDeleteRequest, '/api/cardsets/' + action.cardSetId);
        yield put({ type: GAME_LIST_REQUEST });

        const state = yield select();
        yield put(gameSelectRequest(state.games.active, true));
    } catch (e) {
        yield call(putError, e);
    }
}

export function* handleCardSetRenameRequest(action: CardSetRenameRequest): SagaIterator {
    try {
        yield delay(500);
        yield call(authorizedPutRequest, '/api/cardsets/' + action.cardSetId, { name: action.newName });
    } catch (e) {
        yield call(putError, e);
    }
}

function loadImageInfo(url: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
        try {
            const img = new Image();

            img.addEventListener('load', function () {
                resolve({
                    width: this.naturalWidth,
                    height: this.naturalHeight,
                });
            });
            img.addEventListener('error', function (err) {
                reject(err);
            });
            img.src = url;
        } catch (e) {
            reject(e);
        }
    });
}

export async function processData(data: CardSetSelectSuccessData): Promise<CardSetSelectSuccessDataV3> {
    let processedData = data;

    if (!('version' in processedData)) {
        if (!('placeholdersAllIds' in processedData) && 'placeholders' in processedData) {
            (processedData as CardSetSelectSuccessDataV2).placeholdersAllIds = Object.keys(
                (processedData as CardSetSelectSuccessDataV2).placeholders,
            );
        }

        (processedData as CardSetSelectSuccessDataV2).version = 2;
        for (const plId in (processedData as CardSetSelectSuccessDataV2).placeholders) {
            const placeholder = (processedData as CardSetSelectSuccessDataV2).placeholders[plId];
            placeholder.x += BLEED_WIDTH;
            placeholder.y += BLEED_WIDTH;
        }
    }

    if (processedData.version === 2) {
        const fieldsAllIds = processedData.placeholdersAllIds;
        const fields: FieldInfoByCardCollection = {};

        for (const cardId of processedData.cardsAllIds) {
            fields[cardId] = {};

            for (const fieldId of fieldsAllIds) {
                const placeholder = processedData.placeholders[fieldId];
                if (placeholder.type === 'image') {
                    if (cardId in processedData.images && fieldId in processedData.images[cardId]) {
                        const imageInfo = processedData.images[cardId][fieldId];
                        fields[cardId][fieldId] = {
                            ...placeholder,
                            type: 'image',
                            url: imageInfo && imageInfo.url,
                            global: imageInfo && imageInfo.global,
                            base64: imageInfo && imageInfo.base64,
                            color: imageInfo && imageInfo.color,
                            imageWidth: imageInfo && imageInfo.width,
                            imageHeight: imageInfo && imageInfo.height,
                        };
                    } else {
                        fields[cardId][fieldId] = {
                            ...placeholder,
                            type: 'image',
                        };
                    }
                } else if (placeholder.type === 'text') {
                    if (cardId in processedData.texts && fieldId in processedData.texts[cardId]) {
                        fields[cardId][fieldId] = {
                            ...placeholder,
                            type: 'text',
                            ...processedData.texts[cardId][fieldId],
                        };
                    } else {
                        fields[cardId][fieldId] = {
                            ...placeholder,
                            type: 'text',
                            value: '',
                        };
                    }
                }
            }
        }

        processedData = {
            version: 3,
            width: processedData.width,
            height: processedData.height,
            isTwoSided: processedData.isTwoSided,
            snappingDistance: processedData.snappingDistance,
            cardsAllIds: processedData.cardsAllIds,
            cardsById: processedData.cardsById,
            fields,
            fieldsAllIds,
            zoom: processedData.zoom,
        };
    }

    // We must load image data on each new load because user can upload new images
    // that have different dimensions.
    for (const cardId in processedData.fields) {
        for (const fieldId in processedData.fields[cardId]) {
            const fieldInfo = processedData.fields[cardId][fieldId];
            if (fieldInfo.type === 'image' && fieldInfo.url) {
                try {
                    const info = await loadImageInfo(fieldInfo.url);
                    if (info.width !== fieldInfo.imageWidth || info.height !== fieldInfo.imageHeight) {
                        fieldInfo.imageWidth = info.width;
                        fieldInfo.imageHeight = info.height;
                        fieldInfo.cx = 0;
                        fieldInfo.cy = 0;
                        fieldInfo.zoom = 1;
                    }
                } catch {}
            }
        }
    }

    return processedData;
}

export function* handleCardSetSelectRequest(action: CardSetSelectRequest): SagaIterator {
    try {
        const resp = yield call(authorizedGetRequest, '/api/cardsets/' + action.id);
        const parsedData = JSON.parse(resp.data.data);
        const processedData: CardSetSelectSuccessDataV3 = yield call(processData, parsedData);

        yield call(loadFontsUsedInPlaceholders, processedData);
        yield put({
            type: CARDSETS_SELECT_SUCCESS,
            id: resp.data.id,
            name: resp.data.name,
        });
        yield put({
            type: CARDSET_SELECT_SUCCESS,
            data: processedData,
        });
        yield put(gameSelectRequest(resp.data.gameId, false));
        yield put(ActionCreators.clearHistory());
    } catch (e) {
        yield put({ type: CARDSET_SELECT_FAILURE });
        yield call(putError, e);
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
        yield call(putError, e);
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
        for (const child of node.children) {
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

export function* handleCardSetFitChange(action: CardSetChangeFitForActiveField): SagaIterator {
    try {
        yield delay(100);
        const state: State = yield select();

        if (state.cardset.present.activeFieldId === undefined) {
            return;
        }

        for (const cardId in state.cardset.present.cardsById) {
            const fieldInfo = state.cardset.present.fields[cardId][state.cardset.present.activeFieldId];
            if (fieldInfo.type === 'image' && fieldInfo.url) {
                const imageResp = yield call(authorizedGetRequest, fieldInfo.url);
                if (imageResp.headers['content-type'] === 'image/svg+xml') {
                    if (action.fit === 'stretch') {
                        const svg = adjustSvg(imageResp.data, false, fieldInfo.color);
                        yield put(cardSetChangeImageBase64(cardId, state.cardset.present.activeFieldId, svg));
                    } else if (fieldInfo.color) {
                        const svg = adjustSvg(imageResp.data, true, fieldInfo.color);
                        yield put(cardSetChangeImageBase64(cardId, state.cardset.present.activeFieldId, svg));
                    } else {
                        yield put(cardSetChangeImageBase64(cardId, state.cardset.present.activeFieldId, undefined));
                    }
                }
            }
        }
    } catch (e) {
        yield call(putError, e);
    }
}

export function* handleCardSetChangeImage(action: CardSetChangeImage): SagaIterator {
    try {
        yield delay(100);
        const state: State = yield select();

        const cardsToFix =
            state.cardset.present.applyToAllCards || action.cardId === undefined
                ? state.cardset.present.cardsAllIds
                : [action.cardId];

        for (const cardId of cardsToFix) {
            const cardFields = state.cardset.present.fields[cardId];
            const imageInfo = cardFields[action.fieldId];
            if (imageInfo.type === 'image' && imageInfo.url) {
                const imageResp = yield call(authorizedGetRequest, imageInfo.url);

                if (imageResp.headers['content-type'] === 'image/svg+xml') {
                    const name = imageInfo.name || imageInfo.id;

                    for (const fieldId in cardFields) {
                        const fieldInfo = cardFields[fieldId];

                        if ((fieldInfo.name === name || fieldInfo.id === name) && fieldInfo.type === 'image') {
                            if (fieldInfo.fit === 'stretch') {
                                const svg = adjustSvg(imageResp.data, false, imageInfo.color);
                                yield put(cardSetChangeImageBase64(cardId, fieldId, svg));
                            } else if (imageInfo.color) {
                                const svg = adjustSvg(imageResp.data, true, imageInfo.color);
                                yield put(cardSetChangeImageBase64(cardId, fieldId, svg));
                            } else {
                                yield put(cardSetChangeImageBase64(cardId, fieldId, undefined));
                            }
                        }
                    }
                }
            }
        }
    } catch (e) {
        yield call(putError, e);
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

        yield delay(1000);
        const state: State = yield select();

        const cardsetId = state.cardsets.active;
        if (cardsetId === null) throw Error('Save failed.');
        const data = {
            width: state.cardset.present.width,
            height: state.cardset.present.height,
            isTwoSided: state.cardset.present.isTwoSided,
            snappingDistance: state.cardset.present.snappingDistance,
            version: state.cardset.present.version,
            cardsAllIds: state.cardset.present.cardsAllIds,
            cardsById: state.cardset.present.cardsById,
            fieldsAllIds: state.cardset.present.fieldsAllIds,
            fields: state.cardset.present.fields,
            zoom: state.cardset.present.zoom,
        };

        yield call(authorizedPutRequest, '/api/cardsets/' + cardsetId, {
            name: state.cardsets.byId[cardsetId].name,
            data: JSON.stringify(data),
        });
        yield call(hideProgress, progressId);
        yield call(putInfo, 'Card Set saved');
        allowWindowClose();
    } catch (e) {
        if (progressId !== null) yield call(hideProgress, progressId);
        yield call(putError, e);
        allowWindowClose();
    }
}

// Images
export function* handleImageListRequest(action: ImageListRequest): SagaIterator {
    try {
        yield delay(200);
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
        yield call(putError, e);
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
        takeLatest(GAME_GET_ATTRIBUTIONS_REQUEST, handleGameGetAttributionsRequest),
        takeLatest(CARDSET_CREATE_REQUEST, handleCardSetCreateRequest),
        takeLatest(CARDSET_DELETE_REQUEST, handleCardSetDeleteRequest),
        takeLatest(CARDSET_RENAME_REQUEST, handleCardSetRenameRequest),
        takeLatest(CARDSET_SELECT_REQUEST, handleCardSetSelectRequest),
        takeEvery(CARDSET_UPLOAD_IMAGE, handleCardSetUploadImage),
        takeEvery(CARDSET_DELETE_IMAGE, handleCardSetDeleteImage),
        takeEvery(CARDSET_CHANGE_FIT_FOR_ACTIVE_FIELD, handleCardSetFitChange),
        takeEvery(CARDSET_CHANGE_IMAGE, handleCardSetChangeImage),

        takeLatest(CARDSET_CREATE_CARD, handleCardSetChange),
        takeLatest(CARDSET_ROTATE_CARDS_RIGHT, handleCardSetChange),
        takeLatest(CARDSET_ROTATE_CARDS_LEFT, handleCardSetChange),
        takeLatest(CARDSET_CLONE_CARD, handleCardSetChange),
        takeLatest(CARDSET_REMOVE_CARD, handleCardSetChange),
        takeLatest(CARDSET_UPDATE_CARD_COUNT, handleCardSetChange),
        takeLatest(CARDSET_ADD_TEXT_FIELD, handleCardSetChange),
        takeLatest(CARDSET_ADD_IMAGE_FIELD, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_ACTIVE_FIELD_NAME, handleCardSetChange),
        takeLatest(CARDSET_REMOVE_ACTIVE_FIELD, handleCardSetChange),
        takeLatest(CARDSET_RAISE_ACTIVE_FIELD, handleCardSetChange),
        takeLatest(CARDSET_RAISE_ACTIVE_FIELD_TO_TOP, handleCardSetChange),
        takeLatest(CARDSET_LOWER_ACTIVE_FIELD, handleCardSetChange),
        takeLatest(CARDSET_LOWER_ACTIVE_FIELD_TO_BOTTOM, handleCardSetChange),
        takeLatest(CARDSET_LOCK_ACTIVE_FIELD, handleCardSetChange),
        takeLatest(CARDSET_UNLOCK_ACTIVE_FIELD, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_FIT_FOR_ACTIVE_FIELD, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_CROP_FOR_ACTIVE_FIELD, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_UNCLICKABLE_FOR_ACTIVE_FIELD, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_WIDTH, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_HEIGHT, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_IS_TWO_SIDED, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_SNAPPING_DISTANCE, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_FIELD_POSITION, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_FIELD_PAN, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_FIELD_ZOOM, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_FIELD_SIZE, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_FIELD_ANGLE, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_ACTIVE_TEXT_FIELD_ALIGN, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_ACTIVE_TEXT_FIELD_COLOR, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_ACTIVE_TEXT_FIELD_FONT_FAMILY, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_ACTIVE_TEXT_FIELD_FONT_VARIANT, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_ACTIVE_TEXT_FIELD_FONT_FAMILY_AND_VARIANT, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_ACTIVE_TEXT_FIELD_FONT_SIZE, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_ACTIVE_TEXT_FIELD_LINE_HEIGHT, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_TEXT, handleCardSetChange),
        takeLatest(CARDSET_CHANGE_IMAGE, handleCardSetChange),
        takeLatest(CARDSET_SET_ZOOM, handleCardSetChange),
        takeLatest(CARDSET_IMPORT_DATA, handleCardSetChange),
        takeLatest(CARDSET_UNDO, handleCardSetChange),
        takeLatest(CARDSET_REDO, handleCardSetChange),

        takeLatest(IMAGE_LIST_REQUEST, handleImageListRequest),

        takeLatest(INIT_REQUEST, handleInitRequest),
    ]);
}
