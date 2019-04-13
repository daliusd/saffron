import { connect } from 'react-redux';
import React, { PureComponent } from 'react';

import {
    Dispatch,
    ImageInfo,
    ImagePlaceholderType,
    cardSetActiveCardAndPlaceholder,
    cardSetChangeImage,
    cardSetChangePlaceholderAngle,
    cardSetChangePlaceholderPosition,
    cardSetChangePlaceholderSize,
} from '../actions';
import { State } from '../reducers';
import FieldController from './FieldController';
import emptyImageImage from './image.svg';
import style from './ImageField.module.css';

interface OwnProps {
    cardId: string;
    isOnBack: boolean;
    ppmm: number;
    imagePlaceholder: ImagePlaceholderType;
    cardWidth: number;
    cardHeight: number;
}

interface StateProps {
    imageUrl?: string;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & StateProps & DispatchProps;

class ImageField extends PureComponent<Props> {
    imageDiv: React.RefObject<HTMLDivElement>;
    wasMoved: boolean;

    constructor(props: Props) {
        super(props);
        this.imageDiv = React.createRef();
        this.wasMoved = false;
    }

    componentDidMount() {
        if (!this.imageDiv.current) return;
        this.imageDiv.current.addEventListener('mousedown', this.handleMouseDown);
        this.imageDiv.current.addEventListener('touchstart', this.handleTouchStart);
        this.imageDiv.current.addEventListener('mousemove', this.handleMouseMove);
        this.imageDiv.current.addEventListener('touchmove', this.handleTouchMove, { passive: false });
        this.imageDiv.current.addEventListener('mouseup', this.handleMouseUp);
        this.imageDiv.current.addEventListener('touchend', this.handleTouchEnd, { passive: false });
    }

    handleDrag = (x: number, y: number) => {
        const { dispatch, imagePlaceholder, ppmm } = this.props;
        dispatch(cardSetChangePlaceholderPosition(imagePlaceholder, x / ppmm, y / ppmm));
    };

    handleResize = (width: number, height: number) => {
        const { dispatch, imagePlaceholder, ppmm } = this.props;
        dispatch(cardSetChangePlaceholderSize(imagePlaceholder, width / ppmm, height / ppmm));
    };

    handleRotate = (angle: number) => {
        const { dispatch, imagePlaceholder } = this.props;
        dispatch(cardSetChangePlaceholderAngle(imagePlaceholder, angle));
    };

    handleMouseDown = (event: MouseEvent) => {
        this.wasMoved = false;
        event.preventDefault();
    };

    handleTouchStart = (event: TouchEvent) => {
        this.wasMoved = false;
        event.preventDefault();
    };

    handleMouseMove = (event: MouseEvent) => {
        this.wasMoved = true;
        event.preventDefault();
    };

    handleTouchMove = (event: TouchEvent) => {
        this.wasMoved = true;
        event.preventDefault();
    };

    handleMouseUp = (event: MouseEvent) => {
        this.handleComplete(event);
    };

    handleTouchEnd = (event: TouchEvent) => {
        this.handleComplete(event);
    };

    handleComplete = (event: Event) => {
        const { dispatch, cardId, isOnBack, imagePlaceholder } = this.props;
        if (!this.wasMoved) {
            event.preventDefault();
            dispatch(cardSetActiveCardAndPlaceholder(cardId, isOnBack, imagePlaceholder.id));
        }
    };

    handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        if (this.imageDiv.current !== null) {
            this.imageDiv.current.classList.add(style.over);
        }
        event.preventDefault();
        event.stopPropagation();
    };

    handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        if (this.imageDiv.current !== null) {
            this.imageDiv.current.classList.remove(style.over);
        }
        event.preventDefault();
        event.stopPropagation();
    };

    handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        if (this.imageDiv.current !== null) {
            this.imageDiv.current.classList.remove(style.over);
        }
        event.preventDefault();
        event.stopPropagation();

        const url = event.dataTransfer.getData('URL');
        const imagefilesPos = url.indexOf('/api/imagefiles/');

        if (imagefilesPos !== -1) {
            const { cardId, imagePlaceholder, dispatch } = this.props;

            const ii: ImageInfo = { url: url.substr(imagefilesPos) };
            dispatch(cardSetChangeImage(cardId, imagePlaceholder.id, ii));
        }
    };

    render() {
        const { imagePlaceholder, imageUrl, ppmm, cardWidth, cardHeight } = this.props;

        return (
            <FieldController
                cardId={this.props.cardId}
                placeholderId={imagePlaceholder.id}
                x={imagePlaceholder.x * ppmm}
                y={imagePlaceholder.y * ppmm}
                width={imagePlaceholder.width * ppmm}
                height={imagePlaceholder.height * ppmm}
                angle={imagePlaceholder.angle}
                onDrag={this.handleDrag}
                onResize={this.handleResize}
                onRotate={this.handleRotate}
                cardWidth={cardWidth}
                cardHeight={cardHeight}
                ppmm={ppmm}
            >
                <div
                    ref={this.imageDiv}
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                    onDragOver={this.handleDragOver}
                    onDragLeave={this.handleDragLeave}
                    onDrop={this.handleDrop}
                >
                    <img
                        style={{
                            opacity: imageUrl && imageUrl.length > 0 ? 1 : 0.5,
                            width: imagePlaceholder.fit === 'height' ? 'auto' : '100%',
                            height: !imagePlaceholder.fit || imagePlaceholder.fit === 'width' ? 'auto' : '100%',
                        }}
                        src={imageUrl || emptyImageImage}
                        alt=""
                    />
                </div>
            </FieldController>
        );
    }
}

const mapStateToProps = (state: State, props: OwnProps): StateProps => {
    const imageInfo =
        state.cardsets.images &&
        state.cardsets.images[props.cardId] &&
        state.cardsets.images[props.cardId][props.imagePlaceholder.id];

    let imageUrl: string | undefined = '';
    if (imageInfo) {
        if (imageInfo.base64) {
            imageUrl = 'data:image/svg+xml;base64,' + imageInfo.base64;
        } else {
            imageUrl = imageInfo && imageInfo.url;
        }
    }

    return {
        imageUrl,
    };
};

export default connect<StateProps, DispatchProps, OwnProps, State>(mapStateToProps)(ImageField);
