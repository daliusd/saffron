// @flow
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { connect } from 'react-redux';
import React, { type ElementRef, PureComponent } from 'react';
import ImageSelectionDialog from './ImageSelectionDialog';

import {
    type Dispatch,
    type ImagePlaceholderType,
    cardSetActiveCardAndPlaceholder,
    cardSetChangePlaceholderAngle,
    cardSetChangePlaceholderPosition,
    cardSetChangePlaceholderSize,
} from '../actions';
import FieldController from './FieldController';

type Props = {
    cardId: string,
    imagePlaceholder: ImagePlaceholderType,
    imageUrl: string,
    isActive: boolean,
    dispatch: Dispatch,
};

type State = {
    imageSelectionDialogIsOpen: boolean,
};

class ImageField extends PureComponent<Props, State> {
    imageDiv: ElementRef<any>;
    wasMoved: boolean;

    state = {
        imageSelectionDialogIsOpen: false,
    };

    constructor(props: Props) {
        super();
        this.imageDiv = React.createRef();
        this.wasMoved = false;
    }

    componentDidMount() {
        this.imageDiv.current.addEventListener('mousedown', this.handleMouseDown);
        this.imageDiv.current.addEventListener('mousemove', this.handleMouseMove);
        this.imageDiv.current.addEventListener('mouseup', this.handleMouseUp);
    }

    handleDrag = (x: number, y: number) => {
        const { dispatch, imagePlaceholder } = this.props;
        dispatch(cardSetChangePlaceholderPosition(imagePlaceholder, x, y));
    };

    handleResize = (width: number, height: number) => {
        const { dispatch, imagePlaceholder } = this.props;
        dispatch(cardSetChangePlaceholderSize(imagePlaceholder, width, height));
    };

    handleRotate = (angle: number) => {
        const { dispatch, imagePlaceholder } = this.props;
        dispatch(cardSetChangePlaceholderAngle(imagePlaceholder, angle));
    };

    handleImageSelectionDialogClose = () => {
        this.setState({ imageSelectionDialogIsOpen: false });
    };

    handleMouseDown = (event: MouseEvent) => {
        const { isActive } = this.props;
        if (isActive) {
            event.stopPropagation();
        } else {
            this.wasMoved = false;
            event.preventDefault();
        }
    };

    handleMouseMove = (event: MouseEvent) => {
        const { isActive } = this.props;
        if (isActive) {
            event.stopPropagation();
        } else {
            this.wasMoved = true;
            event.preventDefault();
        }
    };

    handleMouseUp = (event: MouseEvent) => {
        const { dispatch, cardId, imagePlaceholder, isActive } = this.props;
        if (!isActive && !this.wasMoved) {
            event.preventDefault();
            dispatch(cardSetActiveCardAndPlaceholder(cardId, imagePlaceholder.id));

            this.setState({ imageSelectionDialogIsOpen: true });
        }
    };

    render() {
        const { imagePlaceholder, imageUrl } = this.props;

        return (
            <FieldController
                cardId={this.props.cardId}
                placeholderId={imagePlaceholder.id}
                x={imagePlaceholder.x}
                y={imagePlaceholder.y}
                width={imagePlaceholder.width}
                height={imagePlaceholder.height}
                angle={imagePlaceholder.angle}
                onDrag={this.handleDrag}
                onResize={this.handleResize}
                onRotate={this.handleRotate}
            >
                <div
                    ref={this.imageDiv}
                    css={{
                        width: '100%',
                        height: '100%',
                    }}
                >
                    <img
                        src={imageUrl}
                        alt=""
                        css={{
                            filter: 'invert(1)',
                        }}
                    />
                </div>
                <ImageSelectionDialog
                    cardId={this.props.cardId}
                    placeholder={imagePlaceholder}
                    onClose={this.handleImageSelectionDialogClose}
                    isOpen={this.state.imageSelectionDialogIsOpen}
                />
            </FieldController>
        );
    }
}

const mapStateToProps = (state, props) => {
    const imageUrl =
        state.cardsets.images &&
        state.cardsets.images[props.cardId] &&
        state.cardsets.images[props.cardId][props.imagePlaceholder.id]
            ? state.cardsets.images[props.cardId][props.imagePlaceholder.id]
            : '';
    return {
        imageUrl,
        isActive:
            props.cardId === state.cardsets.activeCard &&
            props.imagePlaceholder.id === state.cardsets.activePlaceholder,
    };
};

export default connect(mapStateToProps)(ImageField);
