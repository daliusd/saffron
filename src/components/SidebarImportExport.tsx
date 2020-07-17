import 'filepond/dist/filepond.min.css';

import { FilePond, registerPlugin } from 'react-filepond';
import { connect } from 'react-redux';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import Papa from 'papaparse';
import React, { Component } from 'react';
import md5 from 'md5';
import shortid from 'shortid';

import {
    CardType,
    CardsCollection,
    DispatchProps,
    IdsArray,
    SidebarOwnProps,
    FieldInfoByCardCollection,
    FieldInfoCollection,
} from '../types';
import { FPLoadCallback, FPRevertLoadCallback, cardSetImportData, messageDisplay } from '../actions';
import { State } from '../reducers';
import { downloadBlob } from '../utils';
import style from './SidebarImportExport.module.css';

registerPlugin(FilePondPluginFileValidateType);

interface StateProps {
    activeGame: string | null;
    width: number;
    height: number;
    isTwoSided: boolean;
    cardsAllIds: IdsArray;
    cardsById: CardsCollection;
    fieldsAllIds: IdsArray;
    fields: FieldInfoByCardCollection;
}

type Props = StateProps & DispatchProps & SidebarOwnProps;

export class SidebarImportExport extends Component<Props> {
    prepareImagePaths = (fields: FieldInfoByCardCollection) => {
        const { activeGame } = this.props;
        if (activeGame === null) return fields;

        const ending = '_' + md5(activeGame);

        const preparedImages: FieldInfoByCardCollection = {};

        for (const cardId in fields) {
            const fieldsByCard = { ...fields[cardId] };
            for (const fieldId in fieldsByCard) {
                const imageInfo = { ...fieldsByCard[fieldId] };
                if (imageInfo.type === 'image') {
                    let url = imageInfo.url || '';
                    if (url.endsWith(ending)) {
                        url = url.replace(ending, '');
                    } else {
                        imageInfo.global = true;
                    }

                    imageInfo.url = url.replace('/api/imagefiles/', '');
                }
                fieldsByCard[fieldId] = imageInfo;
            }
            preparedImages[cardId] = fieldsByCard;
        }

        return preparedImages;
    };

    handleExportJson = () => {
        const { width, height, isTwoSided, cardsAllIds, cardsById, fields, fieldsAllIds } = this.props;

        const preparedFields = this.prepareImagePaths(fields);

        const data = {
            width,
            height,
            isTwoSided,
            cardsAllIds,
            cardsById,
            fields: preparedFields,
            fieldsAllIds,
        };

        const json = JSON.stringify(data, null, 4);
        const blob = new Blob([json], { type: 'octet/stream' });
        const url = window.URL.createObjectURL(blob);
        downloadBlob(url, 'cardset.json');
    };

    handleExportCsv = () => {
        const { cardsAllIds, cardsById, fields, fieldsAllIds } = this.props;

        const preparedFields = this.prepareImagePaths(fields);

        const csvData: (string | number)[][] = [];
        const header = ['card_id', 'card_count'];
        const usedNames: { [key: string]: boolean } = {};
        for (const plId of fieldsAllIds) {
            const fieldInfo = fields[cardsAllIds[0]][plId];
            const name = fieldInfo.name || fieldInfo.id;
            if (!(name in usedNames)) {
                header.push(name);
                if (fieldInfo.type === 'image') {
                    header.push(`${name}_global`);
                }
                usedNames[name] = false;
            }
        }
        csvData.push(header);

        for (const cardId of cardsAllIds) {
            const card = cardsById[cardId];

            const dataRow: (string | number)[] = [cardId, card.count];

            const written = { ...usedNames };
            for (const fieldId of fieldsAllIds) {
                const fieldIndo = fields[cardId][fieldId];
                const name = fieldIndo.name || fieldIndo.id;

                if (!written[name]) {
                    const fieldInfo = preparedFields[cardId][fieldId];
                    if (fieldInfo.type === 'text') {
                        dataRow.push(fieldInfo.value);
                    } else if (fieldInfo.type === 'image') {
                        dataRow.push(fieldInfo.url || '');
                        dataRow.push(fieldInfo.global ? 'y' : 'n');
                    }
                    written[name] = true;
                }
            }
            csvData.push(dataRow);
        }

        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: 'octet/stream' });
        const url = window.URL.createObjectURL(blob);
        downloadBlob(url, 'cardset.csv');
    };

    handleProcess = (fieldName: string, file: File, metadata: { [propName: string]: string }, load: FPLoadCallback) => {
        const { dispatch, activeGame, fields, fieldsAllIds, cardsById, cardsAllIds } = this.props;
        if (activeGame === null) return;

        const reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = function (e) {
            if (e.target === null) return;

            let data = null;
            const ending = '_' + md5(activeGame);

            if (file.type === 'application/json') {
                // eslint-disable-next-line
                data = JSON.parse((e.target as any).result);

                for (const cardId in data.fields) {
                    const cardFields: FieldInfoCollection = data.fields[cardId];
                    for (const fieldId in cardFields) {
                        const fieldInfo = cardFields[fieldId];
                        if (fieldInfo.type === 'image') {
                            const isGlobal = fieldInfo.global || false;

                            fieldInfo.url = `/api/imagefiles/${fieldInfo.url}${isGlobal ? '' : ending}`;
                            delete fieldInfo.global;
                        }
                    }
                }
            } else if (file.type === 'text/csv') {
                // eslint-disable-next-line
                const csvData = Papa.parse((e.target as any).result, { header: true });

                const newCardsAllIds: IdsArray = [];
                const newCardsById: CardsCollection = {};
                const newFields: FieldInfoByCardCollection = {};

                for (const rowParsed of csvData.data) {
                    const row = rowParsed as Record<string, string>;
                    if (Object.keys(row).length === 0) {
                        continue;
                    }
                    const card: CardType = {
                        id: row['card_id'] || shortid.generate(),
                        count: parseInt(row['card_count'], 10) || 1,
                    };

                    newFields[card.id] = {
                        ...fields[card.id in cardsById ? card.id : cardsAllIds[0]],
                    };

                    newCardsAllIds.push(card.id);
                    newCardsById[card.id] = card;

                    for (const fieldId of fieldsAllIds) {
                        const fieldInfo = newFields[card.id][fieldId];
                        const name = fieldInfo.name || fieldInfo.id;

                        if (row[name]) {
                            if (fieldInfo.type === 'image') {
                                const isGlobal = row[`${name}_global`] === 'y';
                                const url = row[name];

                                newFields[card.id][fieldId] = {
                                    ...fieldInfo,
                                    url: `/api/imagefiles/${url}${isGlobal ? '' : ending}`,
                                };
                            } else if (fieldInfo.type === 'text') {
                                newFields[card.id][fieldId] = {
                                    ...fieldInfo,
                                    value: row[name],
                                };
                            }
                        }
                    }
                }

                data = {
                    cardsAllIds: newCardsAllIds,
                    cardsById: newCardsById,
                    fields: newFields,
                    activeCardId: undefined,
                    activeFieldId: undefined,
                };
            }

            if (data !== null) {
                dispatch(cardSetImportData(data));
            }
        };
        reader.onerror = function () {
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
        width: state.cardset.present.width,
        height: state.cardset.present.height,
        isTwoSided: state.cardset.present.isTwoSided,
        cardsAllIds: state.cardset.present.cardsAllIds,
        cardsById: state.cardset.present.cardsById,
        fieldsAllIds: state.cardset.present.fieldsAllIds,
        fields: state.cardset.present.fields,
    };
};

export default connect<StateProps, DispatchProps, SidebarOwnProps, State>(mapStateToProps)(SidebarImportExport);
