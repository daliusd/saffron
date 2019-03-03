import 'filepond/dist/filepond.min.css';

import './SidebarUpload.css';

import { FilePond, registerPlugin } from 'react-filepond';
import { connect } from 'react-redux';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import React, { Component } from 'react';
import axios from 'axios';

import { DispatchProps, SidebarOwnProps } from '../types';
import {
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

registerPlugin(FilePondPluginFileValidateSize);
registerPlugin(FilePondPluginFileValidateType);

interface StateProps {
    activeGame: string | null;
}

type Props = StateProps & DispatchProps & SidebarOwnProps;

export class SidebarUpload extends Component<Props> {
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
            <div className={style.view} style={{ display: visible ? 'grid' : 'none' }}>
                <div>
                    Uploaded imaged are kept for limited time. If they are deleted then simply re-upload them again.
                </div>
                <FilePond
                    allowMultiple={true}
                    server={{
                        process: this.handleProcess,
                        revert: this.handleRevert,
                    }}
                    acceptedFileTypes={['image/png', 'image/jpeg', 'image/svg+xml']}
                    allowFileSizeValidation={true}
                    maxFileSize="500KB"
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

export default connect<StateProps, DispatchProps, SidebarOwnProps, State>(mapStateToProps)(SidebarUpload);
