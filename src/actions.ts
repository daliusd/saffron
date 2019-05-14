import shortid from 'shortid';
import { Dispatch as ReduxDispatch } from 'redux';
import { CancelToken } from 'axios';

export const INIT_REQUEST = 'INIT_REQUEST';
export const MESSAGE_DISPLAY = 'MESSAGE_DISPLAY';
export const MESSAGE_HIDE = 'MESSAGE_HIDE';
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const SIGNUP_REQUEST = 'SIGNUP_REQUEST';
export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS';
export const SIGNUP_FAILURE = 'SIGNUP_FAILURE';
export const GAME_CREATE_REQUEST = 'GAME_CREATE_REQUEST';
export const GAME_CREATE_SUCCESS = 'GAME_CREATE_SUCCESS';
export const GAME_CREATE_FAILURE = 'GAME_CREATE_FAILURE';
export const GAME_DELETE_REQUEST = 'GAME_DELETE_REQUEST';
export const GAME_RENAME_REQUEST = 'GAME_RENAME_REQUEST';
export const GAME_LIST_SUCCESS = 'GAME_LIST_SUCCESS';
export const GAME_LIST_REQUEST = 'GAME_LIST_REQUEST';
export const GAME_LIST_FAILURE = 'GAME_LIST_FAILURE';
export const GAME_LIST_RESET = 'GAME_LIST_RESET';
export const GAME_SELECT_REQUEST = 'GAME_SELECT_REQUEST';
export const GAME_SELECT_SUCCESS = 'GAME_SELECT_SUCCESS';
export const GAME_SELECT_FAILURE = 'GAME_SELECT_FAILURE';
export const GAME_CREATE_PDF_REQUEST = 'GAME_CREATE_PDF_REQUEST';
export const GAME_CREATE_PDF_SUCCESS = 'GAME_CREATE_PDF_SUCCESS';
export const GAME_CREATE_PDF_FAILURE = 'GAME_CREATE_PDF_FAILURE';
export const GAME_CREATE_PNG_REQUEST = 'GAME_CREATE_PNG_REQUEST';
export const GAME_CREATE_PNG_SUCCESS = 'GAME_CREATE_PNG_SUCCESS';
export const GAME_CREATE_PNG_FAILURE = 'GAME_CREATE_PNG_FAILURE';
export const CARDSET_CREATE_REQUEST = 'CARDSET_CREATE_REQUEST';
export const CARDSET_CREATE_SUCCESS = 'CARDSET_CREATE_SUCCESS';
export const CARDSET_CREATE_FAILURE = 'CARDSET_CREATE_FAILURE';
export const CARDSET_DELETE_REQUEST = 'CARDSET_DELETE_REQUEST';
export const CARDSET_RENAME_REQUEST = 'CARDSET_RENAME_REQUEST';
export const CARDSET_IMPORT_DATA = 'CARDSET_IMPORT_DATA';
export const CARDSET_LIST_SUCCESS = 'CARDSET_LIST_SUCCESS';
export const CARDSET_LIST_REQUEST = 'CARDSET_LIST_REQUEST';
export const CARDSET_LIST_FAILURE = 'CARDSET_LIST_FAILURE';
export const CARDSET_LIST_RESET = 'CARDSET_LIST_RESET';
export const CARDSET_SELECT_REQUEST = 'CARDSET_SELECT_REQUEST';
export const CARDSET_SELECT_SUCCESS = 'CARDSET_SELECT_SUCCESS';
export const CARDSET_CREATE_CARD = 'CARDSET_CREATE_CARD';
export const CARDSET_CLONE_CARD = 'CARDSET_CLONE_CARD';
export const CARDSET_REMOVE_CARD = 'CARDSET_REMOVE_CARD';
export const CARDSET_UPDATE_CARD_COUNT = 'CARDSET_UPDATE_CARD_COUNT';
export const CARDSET_ADD_TEXT_PLACEHOLDER = 'CARDSET_ADD_TEXT_PLACEHOLDER';
export const CARDSET_ADD_IMAGE_PLACEHOLDER = 'CARDSET_ADD_IMAGE_PLACEHOLDER';
export const CARDSET_CHANGE_ACTIVE_PLACEHOLDER_NAME = 'CARDSET_CHANGE_ACTIVE_PLACEHOLDER_NAME';
export const CARDSET_REMOVE_ACTIVE_PLACEHOLDER = 'CARDSET_REMOVE_ACTIVE_PLACEHOLDER';
export const CARDSET_RAISE_ACTIVE_PLACEHOLDER_TO_TOP = 'CARDSET_RAISE_ACTIVE_PLACEHOLDER_TO_TOP';
export const CARDSET_LOWER_ACTIVE_PLACEHOLDER_TO_BOTTOM = 'CARDSET_LOWER_ACTIVE_PLACEHOLDER_TO_BOTTOM';
export const CARDSET_LOCK_ACTIVE_PLACEHOLDER = 'CARDSET_LOCK_ACTIVE_PLACEHOLDER';
export const CARDSET_UNLOCK_ACTIVE_PLACEHOLDER = 'CARDSET_UNLOCK_ACTIVE_PLACEHOLDER';
export const CARDSET_CHANGE_FIT_FOR_ACTIVE_PLACEHOLDER = 'CARDSET_CHANGE_FIT_FOR_ACTIVE_PLACEHOLDER';
export const CARDSET_CHANGE_WIDTH = 'CARDSET_CHANGE_WIDTH';
export const CARDSET_CHANGE_HEIGHT = 'CARDSET_CHANGE_HEIGHT';
export const CARDSET_CHANGE_IS_TWO_SIDED = 'CARDSET_CHANGE_IS_TWO_SIDED';
export const CARDSET_CHANGE_SNAPPING_DISTANCE = 'CARDSET_CHANGE_SNAPPING_DISTANCE';
export const CARDSET_CHANGE_PLACEHOLDER_POSITION = 'CARDSET_CHANGE_PLACEHOLDER_POSITION';
export const CARDSET_CHANGE_PLACEHOLDER_SIZE = 'CARDSET_CHANGE_PLACEHOLDER_SIZE';
export const CARDSET_CHANGE_PLACEHOLDER_ANGLE = 'CARDSET_CHANGE_PLACEHOLDER_ANGLE';
export const CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_ALIGN = 'CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_ALIGN';
export const CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_COLOR = 'CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_COLOR';
export const CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_FONT_FAMILY = 'CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_FONT_FAMILY';
export const CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_FONT_VARIANT =
    'CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_FONT_VARIANT';
export const CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_FONT_FAMILY_AND_VARIANT =
    'CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_FONT_FAMILY_AND_VARIANT';
export const CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_FONT_SIZE = 'CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_FONT_SIZE';
export const CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_LINE_HEIGHT = 'CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_LINE_HEIGHT';
export const CARDSET_CHANGE_TEXT = 'CARDSET_CHANGE_TEXT';
export const CARDSET_CHANGE_IMAGE = 'CARDSET_CHANGE_IMAGE';
export const CARDSET_CHANGE_IMAGE_BASE64 = 'CARDSET_CHANGE_IMAGE_BASE64';
export const CARDSET_SET_ACTIVE_CARD_AND_PLACEHOLDER = 'CARDSET_SET_ACTIVE_CARD_AND_PLACEHOLDER';
export const CARDSET_UPDATE_DATA_REQUEST = 'CARDSET_UPDATE_DATA_REQUEST';
export const CARDSET_UPDATE_DATA_SUCCESS = 'CARDSET_UPDATE_DATA_SUCCESS';
export const CARDSET_UPDATE_DATA_FAILURE = 'CARDSET_UPDATE_DATA_FAILURE';
export const CARDSET_SELECT_FAILURE = 'CARDSET_SELECT_FAILURE';
export const CARDSET_SET_SIDEBAR_STATE = 'CARDSET_SET_SIDEBAR_STATE';
export const CARDSET_SET_ZOOM = 'CARDSET_SET_ZOOM';
export const CARDSET_UPLOAD_IMAGE = 'CARDSET_UPLOAD_IMAGE';
export const CARDSET_UPLOAD_IMAGE_SUCCESS = 'CARDSET_UPLOAD_IMAGE_SUCCESS';
export const CARDSET_UPLOAD_IMAGE_FAILURE = 'CARDSET_UPLOAD_IMAGE_FAILURE';
export const CARDSET_DELETE_IMAGE = 'CARDSET_DELETE_IMAGE';
export const IMAGE_LIST_REQUEST = 'IMAGE_LIST_REQUEST';
export const IMAGE_LIST_SUCCESS = 'IMAGE_LIST_SUCCESS';
export const IMAGE_LIST_FAILURE = 'IMAGE_LIST_FAILURE';

// Data types

export type IdsArray = string[];

export interface MessageType {
    id: string;
    type: string;
    text: string;
}

export interface GameType {
    id: string;
    name: string;
}

export interface GamesCollection {
    [propName: string]: GameType;
}

export interface PlaceholderBase {
    id: string;
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
    angle: number;
    locked?: boolean;
    name?: string;
    isOnBack?: boolean;
}

export interface TextPlaceholderType extends PlaceholderBase {
    type: 'text';
    align: string;
    color: string;
    fontFamily: string;
    fontVariant: string;
    fontSize: number;
    lineHeight?: number;
}

export interface ImagePlaceholderType extends PlaceholderBase {
    id: string;
    type: 'image';
    fit?: string;
}

export type PlaceholderType = TextPlaceholderType | ImagePlaceholderType;

export interface PlaceholdersCollection {
    [propName: string]: PlaceholderType;
}

export interface TextInfo {
    value: string;
}

export interface PlaceholdersTextInfoCollection {
    [propName: string]: TextInfo;
}

export interface PlaceholdersTextInfoByCardCollection {
    [propName: string]: PlaceholdersTextInfoCollection;
}

export interface ImageInfo {
    url?: string;
    global?: boolean;
    base64?: string;
    color?: string;
}

export interface PlaceholdersImageInfoCollection {
    [propName: string]: ImageInfo;
}

export interface PlaceholdersImageInfoByCardCollection {
    [propName: string]: PlaceholdersImageInfoCollection;
}

export interface CardType {
    id: string;
    count: number;
}

export interface CardsCollection {
    [propName: string]: CardType;
}

export interface CardSetType {
    id: string;
    name: string;
}

export interface CardSetsCollection {
    [propName: string]: CardSetType;
}

export interface Credentials {
    username: string;
    password: string;
}

export interface Image {
    id: number;
    name: string;
}

export type ImageArray = Image[];

// Actions

export interface InitAction {
    type: typeof INIT_REQUEST;
}

export interface MessageDisplay {
    type: typeof MESSAGE_DISPLAY;
    message: MessageType;
}
export type MessageAction = MessageDisplay | { type: typeof MESSAGE_HIDE; messageId: string };

export interface LoginRequest {
    type: typeof LOGIN_REQUEST;
    creds: Credentials;
}
export type LoginAction =
    | LoginRequest
    | { type: typeof LOGIN_SUCCESS }
    | { type: typeof LOGIN_FAILURE; message: string }
    | { type: typeof LOGOUT_REQUEST }
    | { type: typeof LOGOUT_FAILURE }
    | { type: typeof LOGOUT_SUCCESS };

export interface SignUpRequest {
    type: typeof SIGNUP_REQUEST;
    creds: Credentials;
}
export type SignUpAction = SignUpRequest | { type: typeof SIGNUP_SUCCESS } | { type: typeof SIGNUP_FAILURE };

export interface GameCreateRequest {
    type: typeof GAME_CREATE_REQUEST;
    gamename: string;
}
export type GameCreateAction =
    | GameCreateRequest
    | { type: typeof GAME_CREATE_SUCCESS }
    | { type: typeof GAME_CREATE_FAILURE };

export interface GameDeleteRequest {
    type: typeof GAME_DELETE_REQUEST;
    gameId: string;
}

export type GameDeleteAction = GameDeleteRequest;

export interface GameRenameRequest {
    type: typeof GAME_RENAME_REQUEST;
    gameId: string;
    newName: string;
}

export type GameRenameAction = GameRenameRequest;

export interface GameListSuccess {
    type: typeof GAME_LIST_SUCCESS;
    byId: GamesCollection;
    allIds: IdsArray;
}
export type GameListAction =
    | { type: typeof GAME_LIST_REQUEST }
    | GameListSuccess
    | { type: typeof GAME_LIST_FAILURE }
    | { type: typeof GAME_LIST_RESET };

export interface GameSelectRequest {
    type: typeof GAME_SELECT_REQUEST;
    id: string;
    updateCardSets: boolean;
}
export type GameSelectAction =
    | GameSelectRequest
    | { type: typeof GAME_SELECT_SUCCESS; id: string }
    | { type: typeof GAME_SELECT_FAILURE };

export interface GameCreatePdfRequest {
    type: typeof GAME_CREATE_PDF_REQUEST;
    collectionType: string;
    collectionId: string;
    pageWidth: number;
    pageHeight: number;
    topBottomMargin: number;
    leftRightMargin: number;
    verticalSpace: number;
    horizontalSpace: number;
    includeBleedingArea: boolean;
    cutMarksForScissors: boolean;
    cutMarksForGuillotine: boolean;
    cutMarksOnFrontSideOnly: boolean;
}

export type GameCreatePdfAction =
    | GameCreatePdfRequest
    | { type: typeof GAME_CREATE_PDF_SUCCESS }
    | { type: typeof GAME_CREATE_PDF_FAILURE };

export interface GameCreatePngRequest {
    type: typeof GAME_CREATE_PNG_REQUEST;
    dpi: number;
}

export type GameCreatePngAction =
    | GameCreatePngRequest
    | { type: typeof GAME_CREATE_PNG_SUCCESS }
    | { type: typeof GAME_CREATE_PNG_FAILURE };

export type GameAction =
    | GameCreateAction
    | GameDeleteAction
    | GameRenameAction
    | GameListAction
    | GameSelectAction
    | GameCreatePdfAction
    | GameCreatePngAction;

export interface CardSetCreateRequest {
    type: typeof CARDSET_CREATE_REQUEST;
    cardsetname: string;
    width: number;
    height: number;
    gameId: string;
}
export type CardSetCreateAction =
    | CardSetCreateRequest
    | { type: typeof CARDSET_CREATE_SUCCESS }
    | { type: typeof CARDSET_CREATE_FAILURE };

export interface CardSetDeleteRequest {
    type: typeof CARDSET_DELETE_REQUEST;
    cardSetId: string;
}

export interface CardSetRenameRequest {
    type: typeof CARDSET_RENAME_REQUEST;
    cardSetId: string;
    newName: string;
}

export interface CardSetImportData {
    type: typeof CARDSET_IMPORT_DATA;
    data: object;
}

export interface CardSetListSuccess {
    type: typeof CARDSET_LIST_SUCCESS;
    byId: CardSetsCollection;
    allIds: IdsArray;
}
export type CardSetListAction =
    | { type: typeof CARDSET_LIST_REQUEST }
    | CardSetListSuccess
    | { type: typeof CARDSET_LIST_FAILURE }
    | { type: typeof CARDSET_LIST_RESET };

export interface CardSetSelectRequest {
    type: typeof CARDSET_SELECT_REQUEST;
    id: string;
}
export interface CardSetSelectSuccess {
    type: typeof CARDSET_SELECT_SUCCESS;
    id: string;
    name: string;
    data: {
        version: number;
        width: number;
        height: number;
        isTwoSided: boolean;
        snappingDistance: number;
        cardsAllIds: IdsArray;
        cardsById: CardsCollection;
        placeholders: PlaceholdersCollection;
        placeholdersAllIds: IdsArray;
        texts: PlaceholdersTextInfoByCardCollection;
        images: PlaceholdersImageInfoByCardCollection;
        zoom: number;
    };
    gameId: string;
}
export interface CardSetCreateCard {
    type: typeof CARDSET_CREATE_CARD;
    card: CardType;
}
export interface CardSetCloneCard {
    type: typeof CARDSET_CLONE_CARD;
    card: CardType;
}
export interface CardSetRemoveCard {
    type: typeof CARDSET_REMOVE_CARD;
    card: CardType;
}
export interface CardSetUpdateCardCount {
    type: typeof CARDSET_UPDATE_CARD_COUNT;
    card: CardType;
    count: number;
}
export interface CardSetAddTextPlaceholder {
    type: typeof CARDSET_ADD_TEXT_PLACEHOLDER;
}
export interface CardSetAddImagePlaceholder {
    type: typeof CARDSET_ADD_IMAGE_PLACEHOLDER;
}
export interface CardSetChangeActivePlaceholderName {
    type: typeof CARDSET_CHANGE_ACTIVE_PLACEHOLDER_NAME;
    name: string;
}
export interface CardSetRemoveActivePlaceholder {
    type: typeof CARDSET_REMOVE_ACTIVE_PLACEHOLDER;
}
export interface CardSetRaiseActivePlaceholderToTop {
    type: typeof CARDSET_RAISE_ACTIVE_PLACEHOLDER_TO_TOP;
}
export interface CardSetLowerActivePlaceholderToBottom {
    type: typeof CARDSET_LOWER_ACTIVE_PLACEHOLDER_TO_BOTTOM;
}
export interface CardSetLockActivePlaceholder {
    type: typeof CARDSET_LOCK_ACTIVE_PLACEHOLDER;
}
export interface CardSetUnlockActivePlaceholder {
    type: typeof CARDSET_UNLOCK_ACTIVE_PLACEHOLDER;
}
export interface CardSetChangeFitForActivePlaceholder {
    type: typeof CARDSET_CHANGE_FIT_FOR_ACTIVE_PLACEHOLDER;
    fit: string;
}

export interface CardSetChangeWidth {
    type: typeof CARDSET_CHANGE_WIDTH;
    width: number;
}

export interface CardSetChangeHeight {
    type: typeof CARDSET_CHANGE_HEIGHT;
    height: number;
}

export interface CardSetChangeIsTwoSided {
    type: typeof CARDSET_CHANGE_IS_TWO_SIDED;
    isTwoSided: boolean;
}

export interface CardSetChangeSnappingDistance {
    type: typeof CARDSET_CHANGE_SNAPPING_DISTANCE;
    snappingDistance: number;
}

export interface CardSetChangePlaceholderPosition {
    type: typeof CARDSET_CHANGE_PLACEHOLDER_POSITION;
    placeholder: PlaceholderType;
    x: number;
    y: number;
}
export interface CardSetChangePlaceholderSize {
    type: typeof CARDSET_CHANGE_PLACEHOLDER_SIZE;
    placeholder: PlaceholderType;
    width: number;
    height: number;
}
export interface CardSetChangePlaceholderAngle {
    type: typeof CARDSET_CHANGE_PLACEHOLDER_ANGLE;
    placeholder: PlaceholderType;
    angle: number;
}
export interface CardSetChangeActiveTextPlaceholderAlign {
    type: typeof CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_ALIGN;
    align: string;
}
export interface CardSetChangeActiveTextPlaceholderColor {
    type: typeof CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_COLOR;
    color: string;
}
export interface CardSetChangeActiveTextPlaceholderFontFamily {
    type: typeof CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_FONT_FAMILY;
    fontFamily: string;
}
export interface CardSetChangeActiveTextPlaceholderFontVariant {
    type: typeof CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_FONT_VARIANT;
    fontVariant: string;
}
export interface CardSetChangeActiveTextPlaceholderFontFamilyAndVariant {
    type: typeof CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_FONT_FAMILY_AND_VARIANT;
    fontFamily: string;
    fontVariant: string;
}
export interface CardSetChangeActiveTextPlaceholderFontSize {
    type: typeof CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_FONT_SIZE;
    fontSize: number;
}
export interface CardSetChangeActiveTextPlaceholderLineHeight {
    type: typeof CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_LINE_HEIGHT;
    lineHeight: number;
}
export interface CardSetChangeText {
    type: typeof CARDSET_CHANGE_TEXT;
    cardId: string;
    placeholderId: string;
    textInfo: TextInfo;
}
export interface CardSetChangeImage {
    type: typeof CARDSET_CHANGE_IMAGE;
    cardId: string;
    placeholderId: string;
    imageInfo: ImageInfo;
}
export interface CardSetChangeImageBase64 {
    type: typeof CARDSET_CHANGE_IMAGE_BASE64;
    cardId: string;
    placeholderId: string;
    base64?: string;
}
export interface CardSetSetActiveCardAndPlaceholder {
    type: typeof CARDSET_SET_ACTIVE_CARD_AND_PLACEHOLDER;
    cardId: string | null;
    isBackActive: boolean;
    placeholderId: string | null;
}

export enum SidebarState {
    Settings,
    Details,
    Measurements,
    Image,
    Text,
    Upload,
    ImportExport,
    Png,
    Pdf,
}
export interface CardSetSetSidebarState {
    type: typeof CARDSET_SET_SIDEBAR_STATE;
    sidebarState: SidebarState | null;
}
export interface CardSetSetZoom {
    type: typeof CARDSET_SET_ZOOM;
    zoom: number;
}

export type FPLoadCallback = (id: string) => void;
export type FPErrorCallback = (error: string) => void;
export type FPProgressCallback = (computable: boolean, loaded: number, total: number) => void;
export type FPAbortCallback = () => void;
export type FPRevertLoadCallback = () => void;

export interface CardSetUploadImage {
    type: typeof CARDSET_UPLOAD_IMAGE;
    gameId: string;
    file: File;
    load: FPLoadCallback;
    error: FPErrorCallback;
    progress: FPProgressCallback;
    abort: FPAbortCallback;
    cancelToken: CancelToken;
}

export interface CardSetDeleteImage {
    type: typeof CARDSET_DELETE_IMAGE;
    imageId: string;
    load: FPRevertLoadCallback;
    error: FPErrorCallback;
}

export interface CardSetUploadImageSuccess {
    type: typeof CARDSET_UPLOAD_IMAGE_SUCCESS;
}

export interface CardSetUploadImageFailure {
    type: typeof CARDSET_UPLOAD_IMAGE_FAILURE;
}

export type CardSetSelectAction = CardSetSelectRequest | CardSetSelectSuccess | { type: typeof CARDSET_SELECT_FAILURE };

export interface CardSetUpdateDataRequest {
    type: typeof CARDSET_UPDATE_DATA_REQUEST;
}
export interface CardSetUpdateDataSuccess {
    type: typeof CARDSET_UPDATE_DATA_SUCCESS;
}
export interface CardSetUpdateDataFailure {
    type: typeof CARDSET_UPDATE_DATA_FAILURE;
}
export type CardSetUpdateDataAction = CardSetUpdateDataRequest | CardSetUpdateDataSuccess | CardSetUpdateDataFailure;

export type CardSetModifyAction =
    | CardSetCreateCard
    | CardSetCloneCard
    | CardSetRemoveCard
    | CardSetUpdateCardCount
    | CardSetAddTextPlaceholder
    | CardSetAddImagePlaceholder
    | CardSetChangeActivePlaceholderName
    | CardSetRemoveActivePlaceholder
    | CardSetRaiseActivePlaceholderToTop
    | CardSetLowerActivePlaceholderToBottom
    | CardSetLockActivePlaceholder
    | CardSetUnlockActivePlaceholder
    | CardSetChangeFitForActivePlaceholder
    | CardSetChangeWidth
    | CardSetChangeHeight
    | CardSetChangeIsTwoSided
    | CardSetChangeSnappingDistance
    | CardSetChangePlaceholderPosition
    | CardSetChangePlaceholderSize
    | CardSetChangePlaceholderAngle
    | CardSetChangeActiveTextPlaceholderAlign
    | CardSetChangeActiveTextPlaceholderColor
    | CardSetChangeActiveTextPlaceholderFontFamily
    | CardSetChangeActiveTextPlaceholderFontVariant
    | CardSetChangeActiveTextPlaceholderFontFamilyAndVariant
    | CardSetChangeActiveTextPlaceholderFontSize
    | CardSetChangeActiveTextPlaceholderLineHeight
    | CardSetChangeText
    | CardSetChangeImage
    | CardSetChangeImageBase64
    | CardSetSetActiveCardAndPlaceholder
    | CardSetSetSidebarState
    | CardSetSetZoom
    | CardSetUploadImage
    | CardSetDeleteImage
    | CardSetUploadImageSuccess
    | CardSetUploadImageFailure;

export type CardSetAction =
    | CardSetCreateAction
    | CardSetDeleteRequest
    | CardSetRenameRequest
    | CardSetImportData
    | CardSetListAction
    | CardSetSelectAction
    | CardSetUpdateDataAction
    | CardSetModifyAction;

export interface ImageListRequest {
    type: typeof IMAGE_LIST_REQUEST;
    filter: string;
    location: string;
}
export interface ImageListSuccess {
    type: typeof IMAGE_LIST_SUCCESS;
    images: ImageArray;
}
export type ImageListAction = ImageListRequest | ImageListSuccess | { type: typeof IMAGE_LIST_FAILURE };

export type Action =
    | InitAction
    | LoginAction
    | SignUpAction
    | GameAction
    | CardSetAction
    | ImageListAction
    | MessageAction;

export type Dispatch = ReduxDispatch<Action>;

export const messageDisplay = (type: string, text: string, id?: string): MessageDisplay => {
    return {
        type: MESSAGE_DISPLAY,
        message: {
            id: id || shortid.generate(),
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

export const gameDeleteRequest = (gameId: string): GameAction => {
    return {
        type: GAME_DELETE_REQUEST,
        gameId,
    };
};

export const gameRenameRequest = (gameId: string, newName: string): GameAction => {
    return {
        type: GAME_RENAME_REQUEST,
        gameId,
        newName,
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

export const gameCreatePdfRequest = (
    collectionType: string,
    collectionId: string,
    pageWidth: number,
    pageHeight: number,
    topBottomMargin: number,
    leftRightMargin: number,
    verticalSpace: number,
    horizontalSpace: number,
    includeBleedingArea: boolean,
    cutMarksForScissors: boolean,
    cutMarksForGuillotine: boolean,
    cutMarksOnFrontSideOnly: boolean,
): GameCreatePdfRequest => {
    return {
        type: GAME_CREATE_PDF_REQUEST,
        collectionType,
        collectionId,
        pageWidth,
        pageHeight,
        topBottomMargin,
        leftRightMargin,
        verticalSpace,
        horizontalSpace,
        includeBleedingArea,
        cutMarksForScissors,
        cutMarksForGuillotine,
        cutMarksOnFrontSideOnly,
    };
};

export const gameCreatePngRequest = (dpi: number): GameCreatePngRequest => {
    return {
        type: GAME_CREATE_PNG_REQUEST,
        dpi,
    };
};

export const cardSetCreateRequest = (
    cardsetname: string,
    width: number,
    height: number,
    gameId: string,
): CardSetAction => {
    return {
        type: CARDSET_CREATE_REQUEST,
        cardsetname: cardsetname,
        width,
        height,
        gameId,
    };
};

export const cardSetDeleteRequest = (cardSetId: string): CardSetAction => {
    return {
        type: CARDSET_DELETE_REQUEST,
        cardSetId,
    };
};

export const cardSetRenameRequest = (cardSetId: string, newName: string): CardSetAction => {
    return {
        type: CARDSET_RENAME_REQUEST,
        cardSetId,
        newName,
    };
};

export const cardSetImportData = (data: object): CardSetImportData => {
    return {
        type: CARDSET_IMPORT_DATA,
        data,
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

export const cardSetAddImagePlaceholder = (): CardSetAddImagePlaceholder => {
    return {
        type: CARDSET_ADD_IMAGE_PLACEHOLDER,
    };
};

export const cardSetChangeActivePlaceholderName = (name: string): CardSetChangeActivePlaceholderName => {
    return {
        type: CARDSET_CHANGE_ACTIVE_PLACEHOLDER_NAME,
        name,
    };
};

export const cardSetRemoveActivePlaceholder = (): CardSetRemoveActivePlaceholder => {
    return {
        type: CARDSET_REMOVE_ACTIVE_PLACEHOLDER,
    };
};

export const cardSetRaiseActivePlaceholderToTop = (): CardSetRaiseActivePlaceholderToTop => {
    return {
        type: CARDSET_RAISE_ACTIVE_PLACEHOLDER_TO_TOP,
    };
};

export const cardSetLowerActivePlaceholderToBottom = (): CardSetLowerActivePlaceholderToBottom => {
    return {
        type: CARDSET_LOWER_ACTIVE_PLACEHOLDER_TO_BOTTOM,
    };
};

export const cardSetLockActivePlaceholder = (): CardSetLockActivePlaceholder => {
    return {
        type: CARDSET_LOCK_ACTIVE_PLACEHOLDER,
    };
};

export const cardSetUnlockActivePlaceholder = (): CardSetUnlockActivePlaceholder => {
    return {
        type: CARDSET_UNLOCK_ACTIVE_PLACEHOLDER,
    };
};

export const cardSetChangeFitForActivePlaceholder = (fit: string): CardSetChangeFitForActivePlaceholder => {
    return {
        type: CARDSET_CHANGE_FIT_FOR_ACTIVE_PLACEHOLDER,
        fit,
    };
};

export const cardSetChangeWidth = (width: number): CardSetChangeWidth => {
    return {
        type: CARDSET_CHANGE_WIDTH,
        width,
    };
};

export const cardSetChangeHeight = (height: number): CardSetChangeHeight => {
    return {
        type: CARDSET_CHANGE_HEIGHT,
        height,
    };
};

export const cardSetChangeIsTwoSided = (isTwoSided: boolean): CardSetChangeIsTwoSided => {
    return {
        type: CARDSET_CHANGE_IS_TWO_SIDED,
        isTwoSided,
    };
};

export const cardSetChangeSnappingDistance = (snappingDistance: number): CardSetChangeSnappingDistance => {
    return {
        type: CARDSET_CHANGE_SNAPPING_DISTANCE,
        snappingDistance,
    };
};

export const cardSetChangePlaceholderPosition = (
    placeholder: PlaceholderType,
    x: number,
    y: number,
): CardSetChangePlaceholderPosition => {
    return {
        type: CARDSET_CHANGE_PLACEHOLDER_POSITION,
        placeholder,
        x,
        y,
    };
};

export const cardSetChangePlaceholderSize = (
    placeholder: PlaceholderType,
    width: number,
    height: number,
): CardSetChangePlaceholderSize => {
    return {
        type: CARDSET_CHANGE_PLACEHOLDER_SIZE,
        placeholder,
        width,
        height,
    };
};

export const cardSetChangePlaceholderAngle = (
    placeholder: PlaceholderType,
    angle: number,
): CardSetChangePlaceholderAngle => {
    return {
        type: CARDSET_CHANGE_PLACEHOLDER_ANGLE,
        placeholder,
        angle,
    };
};

export const cardSetChangeActiveTextPlaceholderAlign = (align: string): CardSetChangeActiveTextPlaceholderAlign => {
    return {
        type: CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_ALIGN,
        align,
    };
};

export const cardSetChangeActiveTextPlaceholderColor = (color: string): CardSetChangeActiveTextPlaceholderColor => {
    return {
        type: CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_COLOR,
        color,
    };
};

export const cardSetChangeActiveTextPlaceholderFontFamily = (
    fontFamily: string,
): CardSetChangeActiveTextPlaceholderFontFamily => {
    return {
        type: CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_FONT_FAMILY,
        fontFamily,
    };
};

export const cardSetChangeActiveTextPlaceholderFontVariant = (
    fontVariant: string,
): CardSetChangeActiveTextPlaceholderFontVariant => {
    return {
        type: CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_FONT_VARIANT,
        fontVariant,
    };
};

export const cardSetChangeActiveTextPlaceholderFontFamilyAndVariant = (
    fontFamily: string,
    fontVariant: string,
): CardSetChangeActiveTextPlaceholderFontFamilyAndVariant => {
    return {
        type: CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_FONT_FAMILY_AND_VARIANT,
        fontFamily,
        fontVariant,
    };
};

export const cardSetChangeActiveTextPlaceholderFontSize = (
    fontSize: number,
): CardSetChangeActiveTextPlaceholderFontSize => {
    return {
        type: CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_FONT_SIZE,
        fontSize,
    };
};

export const cardSetChangeActiveTextPlaceholderLineHeight = (
    lineHeight: number,
): CardSetChangeActiveTextPlaceholderLineHeight => {
    return {
        type: CARDSET_CHANGE_ACTIVE_TEXT_PLACEHOLDER_LINE_HEIGHT,
        lineHeight,
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

export const cardSetChangeImage = (cardId: string, placeholderId: string, imageInfo: ImageInfo): CardSetChangeImage => {
    return {
        type: CARDSET_CHANGE_IMAGE,
        cardId,
        placeholderId,
        imageInfo,
    };
};

export const cardSetChangeImageBase64 = (
    cardId: string,
    placeholderId: string,
    base64?: string,
): CardSetChangeImageBase64 => {
    return {
        type: CARDSET_CHANGE_IMAGE_BASE64,
        cardId,
        placeholderId,
        base64,
    };
};

export const cardSetActiveCardAndPlaceholder = (
    cardId: string | null,
    isBackActive: boolean,
    placeholderId: string | null,
): CardSetSetActiveCardAndPlaceholder => {
    return {
        type: CARDSET_SET_ACTIVE_CARD_AND_PLACEHOLDER,
        cardId,
        isBackActive,
        placeholderId,
    };
};

export const cardSetSetSidebarState = (sidebarState: SidebarState | null): CardSetSetSidebarState => {
    return {
        type: CARDSET_SET_SIDEBAR_STATE,
        sidebarState,
    };
};

export const cardSetSetZoom = (zoom: number): CardSetSetZoom => {
    return {
        type: CARDSET_SET_ZOOM,
        zoom,
    };
};

export const cardSetUploadImage = (
    gameId: string,
    file: File,
    load: FPLoadCallback,
    error: FPErrorCallback,
    progress: FPProgressCallback,
    abort: FPAbortCallback,
    cancelToken: CancelToken,
): CardSetUploadImage => {
    return {
        type: CARDSET_UPLOAD_IMAGE,
        gameId,
        file,
        load,
        error,
        progress,
        abort,
        cancelToken,
    };
};

export const cardSetDeleteImage = (
    imageId: string,
    load: FPRevertLoadCallback,
    error: FPErrorCallback,
): CardSetDeleteImage => {
    return {
        type: CARDSET_DELETE_IMAGE,
        imageId,
        load,
        error,
    };
};

export const imageListRequest = (filter: string, location: string): ImageListAction => {
    return {
        type: IMAGE_LIST_REQUEST,
        filter,
        location,
    };
};
