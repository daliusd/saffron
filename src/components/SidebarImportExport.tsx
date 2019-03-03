import 'filepond/dist/filepond.min.css';

import { FilePond, registerPlugin } from 'react-filepond';
import { connect } from 'react-redux';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import Papa from 'papaparse';
import React, { Component } from 'react';
import md5 from 'md5';

import {
    CardsCollection,
    FPLoadCallback,
    FPRevertLoadCallback,
    IdsArray,
    PlaceholdersCollection,
    PlaceholdersImageInfoByCardCollection,
    PlaceholdersTextInfoByCardCollection,
    cardSetImportData,
    messageDisplay,
} from '../actions';
import { DispatchProps, SidebarOwnProps } from '../types';
import { State } from '../reducers';
import { downloadBlob } from '../utils';
import style from './SidebarImportExport.module.css';

registerPlugin(FilePondPluginFileValidateType);

interface StateProps {
    activeGame: string | null;
    width: number;
    height: number;
    cardsAllIds: IdsArray;
    cardsById: CardsCollection;
    placeholders: PlaceholdersCollection;
    placeholdersAllIds: IdsArray;
    texts: PlaceholdersTextInfoByCardCollection;
    images: PlaceholdersImageInfoByCardCollection;
}

type Props = StateProps & DispatchProps & SidebarOwnProps;

export class SidebarImportExport extends Component<Props> {
    prepareImagePaths = (images: PlaceholdersImageInfoByCardCollection) => {
        const { activeGame } = this.props;
        if (activeGame === null) return images;

        const ending = '_' + md5(activeGame);

        let preparedImages: PlaceholdersImageInfoByCardCollection = {};

        for (const cardId in images) {
            let imagesByCard = { ...images[cardId] };
            for (const placeholderId in imagesByCard) {
                let imageInfo = { ...imagesByCard[placeholderId] };
                let url = imageInfo.url;
                if (url.endsWith(ending)) {
                    url = url.replace(ending, '');
                } else {
                    imageInfo.global = true;
                }

                imageInfo.url = url.replace('/api/imagefiles/', '');

                imagesByCard[placeholderId] = imageInfo;
            }
            preparedImages[cardId] = imagesByCard;
        }

        return preparedImages;
    };

    handleExportJson = () => {
        const { width, height, cardsAllIds, cardsById, placeholders, placeholdersAllIds, texts, images } = this.props;

        const preparedImages = this.prepareImagePaths(images);

        const data = {
            width,
            height,
            cardsAllIds,
            cardsById,
            placeholders,
            placeholdersAllIds,
            texts,
            images: preparedImages,
        };

        let json = JSON.stringify(data, null, 4);
        let blob = new Blob([json], { type: 'octet/stream' });
        let url = window.URL.createObjectURL(blob);
        downloadBlob(url, 'cardset.json');
    };

    handleExportCsv = () => {
        const { cardsAllIds, cardsById, placeholders, placeholdersAllIds, texts, images } = this.props;

        const preparedImages = this.prepareImagePaths(images);

        let csvData: (string | number)[][] = [];
        let header = ['card_id', 'card_count'];
        let usedNames: { [key: string]: boolean } = {};
        for (const plId of placeholdersAllIds) {
            const placeholder = placeholders[plId];
            const name = placeholder.name || placeholder.id;
            if (!(name in usedNames)) {
                header.push(name);
                if (placeholder.type === 'image') {
                    header.push(`${name}_global`);
                }
                usedNames[name] = false;
            }
        }
        csvData.push(header);

        for (const cardId of cardsAllIds) {
            let card = cardsById[cardId];

            let dataRow: (string | number)[] = [cardId, card.count];

            let written = { ...usedNames };
            for (const plId of placeholdersAllIds) {
                const placeholder = placeholders[plId];
                const name = placeholder.name || placeholder.id;

                if (!written[name]) {
                    if (placeholder.type === 'text') {
                        dataRow.push(texts[cardId][plId].value);
                    } else if (placeholder.type === 'image') {
                        const image = preparedImages[cardId][plId];
                        dataRow.push(image.url);
                        dataRow.push(image.global ? 'y' : 'n');
                    }
                    written[name] = true;
                }
            }
            csvData.push(dataRow);
        }

        let csv = Papa.unparse(csvData);
        let blob = new Blob([csv], { type: 'octet/stream' });
        let url = window.URL.createObjectURL(blob);
        downloadBlob(url, 'cardset.csv');
    };

    handleProcess = (fieldName: string, file: File, metadata: { [propName: string]: string }, load: FPLoadCallback) => {
        const { dispatch, activeGame } = this.props;
        if (activeGame === null) return;

        var reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = function(e) {
            if (e.target === null) return;

            let data = null;
            const ending = '_' + md5(activeGame);

            if (file.type === 'application/json') {
                // eslint-disable-next-line
                data = JSON.parse((e.target as any).result);

                for (const cardId in data.images) {
                    const placeholders = data.images[cardId];
                    for (const placeholderId in placeholders) {
                        let imageInfo = placeholders[placeholderId];
                        let isGlobal = imageInfo.global || false;

                        imageInfo.url = `/api/imagefiles/${imageInfo.url}${isGlobal ? '' : ending}`;
                        delete imageInfo.global;
                    }
                }
            } else if (file.type === 'text/csv') {
            }

            if (data !== null) {
                dispatch(cardSetImportData(data));
            }
        };
        reader.onerror = function() {
            dispatch(messageDisplay('error', 'Problem during import.'));
        };

        load(file.name);
    };

    handleRevert = (uniqueFileId: string, load: FPRevertLoadCallback) => {
        load();
    };

    render() {
        const { visible } = this.props;

        return (
            <div className={style.view} style={{ display: visible ? 'grid' : 'none' }}>
                <div>
                    Here you can export and import your card set data. JSON file contains templates of cards, text and
                    image data by card, CSV file contains only text and image data by card.
                </div>
                <button onClick={this.handleExportJson}>
                    <i className="material-icons">cloud_download</i> Get JSON
                </button>
                <button onClick={this.handleExportCsv}>
                    <i className="material-icons">cloud_download</i> Get CSV
                </button>

                <div>Drag & Drop or browser for JSON or CSV file here:</div>

                <FilePond
                    server={{
                        process: this.handleProcess,
                        revert: this.handleRevert,
                    }}
                    acceptedFileTypes={['text/csv', 'application/json']}
                />
            </div>
        );
    }
}

const mapStateToProps = (state: State): StateProps => {
    return {
        activeGame: state.games.active,
        width: state.cardsets.width,
        height: state.cardsets.height,
        cardsAllIds: state.cardsets.cardsAllIds,
        cardsById: state.cardsets.cardsById,
        placeholders: state.cardsets.placeholders,
        placeholdersAllIds: state.cardsets.placeholdersAllIds,
        texts: state.cardsets.texts,
        images: state.cardsets.images,
    };
};

export default connect<StateProps, DispatchProps, SidebarOwnProps, State>(mapStateToProps)(SidebarImportExport);
