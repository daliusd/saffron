import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';
import 'filepond/dist/filepond.min.css';

import './SidebarUpload.css';

import { FilePond, registerPlugin } from 'react-filepond';
import { connect } from 'react-redux';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import React, { Component } from 'react';
import axios from 'axios';

import {
    Dispatch,
    FPAbortCallback,
    FPErrorCallback,
    FPLoadCallback,
    FPProgressCallback,
    FPRevertLoadCallback,
    cardSetDeleteImage,
    cardSetUploadImage,
} from '../actions';
import { State } from '../reducers';
import style from './SidebarUpload.module.css';

registerPlugin(FilePondPluginImagePreview);
registerPlugin(FilePondPluginFileValidateType);

interface OwnProps {
    visible: boolean;
}

interface StateProps {
    activeGame: string | null;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = StateProps & DispatchProps & OwnProps;

export class SidebarDetails extends Component<Props> {
    handleProcess = (
        fieldName: string,
        file: File,
        metadata: { [propName: string]: string },
        load: FPLoadCallback,
        error: FPErrorCallback,
        progress: FPProgressCallback,
        abort: FPAbortCallback,
    ) => {
        const { dispatch, activeGame } = this.props;

        if (activeGame === null) {
            abort();
            return;
        }

        let source = axios.CancelToken.source();

        dispatch(cardSetUploadImage(activeGame, file, load, error, progress, abort, source.token));

        return { abort: source.cancel };
    };

    handleRevert = (uniqueFileId: string, load: FPRevertLoadCallback, error: FPErrorCallback) => {
        console.log(uniqueFileId);

        const { dispatch } = this.props;
        dispatch(cardSetDeleteImage(uniqueFileId, load, error));
    };

    render() {
        const { visible } = this.props;

        return (
            <div className={style.view} style={{ display: visible ? 'initial' : 'none' }}>
                <FilePond
                    allowMultiple={true}
                    server={{
                        process: this.handleProcess,
                        revert: this.handleRevert,
                    }}
                    acceptedFileTypes={['image/png', 'image/jpeg', 'image/svg+xml']}
                />
            </div>
        );
    }
}

const mapStateToProps = (state: State): StateProps => {
    return {
        activeGame: state.games.active,
    };
};

export default connect<StateProps, DispatchProps, OwnProps, State>(mapStateToProps)(SidebarDetails);
