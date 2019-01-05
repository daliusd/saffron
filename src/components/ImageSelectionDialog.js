// @flow
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import { Component } from 'react';

import {
    type Dispatch,
    type ImageArray,
    type ImagePlaceholderType,
    cardSetChangeImage,
    imageListRequest,
} from '../actions';

type Props = {
    imageUrl: string,
    cardId: string,
    placeholder: ImagePlaceholderType,
    isOpen: boolean,
    filter: string,
    images: ImageArray,
    onClose: () => void,
    dispatch: Dispatch,
};

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

    handleFilterChange = event => {
        const { dispatch } = this.props;
        dispatch(imageListRequest(event.target.value));
    };

    handleImageSelect = imageName => {
        const { dispatch, cardId, placeholder } = this.props;

        dispatch(cardSetChangeImage(cardId, placeholder.id, `/api/imagefiles/${imageName}`));

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
                        filter: 'invert(1)',
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
                                onClick={event => this.handleImageSelect(im.name)}
                                alt=""
                                css={{
                                    filter: 'invert(1)',
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

const mapStateToProps = state => {
    return {
        images: state.images.images,
        filter: state.images.filter,
    };
};

export default connect(mapStateToProps)(ImageSelectionDialog);
