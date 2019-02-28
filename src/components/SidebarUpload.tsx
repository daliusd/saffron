import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';
import 'filepond/dist/filepond.min.css';

import './SidebarUpload.css';

import { FilePond, registerPlugin } from 'react-filepond';
import { connect } from 'react-redux';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import React, { Component } from 'react';

import { Dispatch, messageRequest } from '../actions';
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
    handleAddFile = (error: { main: string; sub: string }, file: object) => {
        const { dispatch } = this.props;
        if (error !== null) {
            dispatch(messageRequest('error', error.main));
            return;
        }
        // console.log(error);
        console.log(file);
        // file.serverId
        // console.log(file.filenameWithoutExtension);
    };

    render() {
        const { visible } = this.props;

        return (
            <div className={style.view} style={{ display: visible ? 'initial' : 'none' }}>
                <FilePond
                    allowMultiple={true}
                    server="/api/filepond"
                    allowRevert={false}
                    onaddfile={this.handleAddFile}
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
