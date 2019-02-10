/** @jsx jsx */
import { connect } from 'react-redux';
import { jsx } from '@emotion/core';
import Modal from 'react-modal';
import React, { Component } from 'react';

import {
    Dispatch,
    ImageArray,
    ImageInfo,
    ImagePlaceholderType,
    cardSetChangeImage,
    imageListRequest,
} from '../actions';
import { State } from '../reducers';

jsx; // eslint-disable-line

interface Props {
    imageUrl: string;
    cardId: string;
    placeholder: ImagePlaceholderType;
    isOpen: boolean;
    filter: string;
    images: ImageArray;
    onClose: () => void;
    dispatch: Dispatch;
}

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

class ImageSelectionDialog extends Component<Props> {
    componentWillMount = () => {
        Modal.setAppElement('#root');
    };

    handleClose = () => {
        this.props.onClose();
    };

    handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { dispatch } = this.props;
        dispatch(imageListRequest(event.target.value));
    };

    handleImageSelect = (imageName: string) => {
        const { dispatch, cardId, placeholder } = this.props;

        const ii: ImageInfo = { url: `/api/imagefiles/${imageName}` };
        dispatch(cardSetChangeImage(cardId, placeholder.id, ii));

        this.props.onClose();
    };

    render() {
        return (
            <Modal
                isOpen={this.props.isOpen}
                onRequestClose={this.handleClose}
                style={customStyles}
                contentLabel="Select an image"
            >
                <img
                    src={this.props.imageUrl}
                    alt=""
                    css={{
                        width: 100,
                        height: 100,
                    }}
                />

                <input type="text" value={this.props.filter} onChange={this.handleFilterChange} />

                <div>
                    {this.props.images.map(im => {
                        return (
                            <img
                                key={im.id}
                                src={`/api/imagefiles/${im.name}`}
                                onClick={() => this.handleImageSelect(im.name)}
                                alt=""
                                css={{
                                    width: 100,
                                    height: 100,
                                }}
                            />
                        );
                    })}
                </div>

                <button onClick={this.handleClose}>close</button>
            </Modal>
        );
    }
}

const mapStateToProps = (state: State) => {
    return {
        images: state.images.images,
        filter: state.images.filter,
    };
};

export default connect(mapStateToProps)(ImageSelectionDialog);
