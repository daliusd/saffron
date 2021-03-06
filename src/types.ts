import { Dispatch } from './actions';

export interface SidebarOwnProps {
    visible: boolean;
}

export interface DispatchProps {
    dispatch: Dispatch;
}

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
    zoom?: number;
    cx?: number;
    cy?: number;
    crop?: boolean;
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
    width?: number;
    height?: number;
}

export interface PlaceholdersImageInfoCollection {
    [propName: string]: ImageInfo;
}

export interface PlaceholdersImageInfoByCardCollection {
    [propName: string]: PlaceholdersImageInfoCollection;
}

export interface FieldBaseInfo {
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
    unclickable?: boolean;
}

export interface TextFieldInfo extends FieldBaseInfo {
    type: 'text';
    value: string;
    align: string;
    color: string;
    fontFamily: string;
    fontVariant: string;
    fontSize: number;
    lineHeight?: number;
}

export interface ImageFieldInfo extends FieldBaseInfo {
    type: 'image';
    url?: string;
    global?: boolean;
    base64?: string;
    color?: string;
    imageWidth?: number;
    imageHeight?: number;
    fit?: string;
    zoom?: number;
    cx?: number;
    cy?: number;
    crop?: boolean;
}

export type FieldInfo = TextFieldInfo | ImageFieldInfo;

export interface FieldInfoCollection {
    [propName: string]: FieldInfo;
}

export interface FieldInfoByCardCollection {
    [propName: string]: FieldInfoCollection;
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
    width: number;
    height: number;
}

export type ImageArray = Image[];

export interface CardSetData {
    width: number;
    height: number;
    isTwoSided: boolean;
    cardsAllIds: string[];
    cardsById: CardsCollection;
    fieldsAllIds: string[];
    fields: FieldInfoByCardCollection;
}

export enum ImageType {
    SVG,
    SVG_PATH,
    IMAGE,
    BLOCK_START,
    BLOCK_END,
}

export interface ImageToDraw {
    type: ImageType;
    x: number;
    y: number;
    width: number;
    height: number;
    angle: number;
    fit?: string;
    data: string;
    color?: string;
    scale?: number;
    imageWidth?: number;
    imageHeight?: number;
    zoom?: number;
    cx?: number;
    cy?: number;
    crop?: boolean;
}
