import 'filepond/dist/filepond.min.css';

import { FilePond, registerPlugin } from 'react-filepond';
import { connect } from 'react-redux';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import React, { Component } from 'react';
import md5 from 'md5';

import {
    CardsCollection,
    IdsArray,
    PlaceholdersCollection,
    PlaceholdersImageInfoByCardCollection,
    PlaceholdersTextInfoByCardCollection,
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
    handleProcess = () =>
        // fieldName: string,
        // file: File,
        // metadata: { [propName: string]: string },
        // load: FPLoadCallback,
        // error: FPErrorCallback,
        // progress: FPProgressCallback,
        // abort: FPAbortCallback,
        {};

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
            preparedImages,
        };

        let json = JSON.stringify(data, null, 4);
        let blob = new Blob([json], { type: 'octet/stream' });
        let url = window.URL.createObjectURL(blob);
        downloadBlob(url, 'cardset.json');
    };

    handleExportCsv = () => {
        console.log('csv data');
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

                <FilePond
                    server={{
                        process: this.handleProcess,
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
