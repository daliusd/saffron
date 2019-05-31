import { connect } from 'react-redux';
import React, { PureComponent } from 'react';

import {
    Dispatch,
    cardSetActiveCardAndPlaceholder,
    cardSetChangeImage,
    cardSetChangePlaceholderAngle,
    cardSetChangePlaceholderPan,
    cardSetChangePlaceholderPosition,
    cardSetChangePlaceholderZoom,
    cardSetChangePlaceholderSize,
} from '../actions';
import { ImageInfo, ImageFieldInfo } from '../types';
import { State } from '../reducers';
import FieldController from './FieldController';
import emptyImageImage from './image.svg';
import style from './ImageField.module.css';

interface OwnProps {
    cardId: string;
    isOnBack: boolean;
    ppmm: number;
    imageFieldInfo: ImageFieldInfo;
    cardWidth: number;
    cardHeight: number;
}

interface StateProps {
    imageUrl?: string;
    imageWidth: number;
    imageHeight: number;
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
        const { dispatch, imageFieldInfo, ppmm } = this.props;
        dispatch(cardSetChangePlaceholderPosition(imageFieldInfo, x / ppmm, y / ppmm));
    };

    handlePan = (cx: number, cy: number) => {
        const { dispatch, imageFieldInfo, ppmm } = this.props;
        dispatch(cardSetChangePlaceholderPan(imageFieldInfo, cx / ppmm, cy / ppmm));
    };

    handleZoom = (zoom: number) => {
        const { dispatch, imageFieldInfo } = this.props;
        dispatch(cardSetChangePlaceholderZoom(imageFieldInfo, zoom));
    };

    handleResize = (width: number, height: number) => {
        const { dispatch, imageFieldInfo, ppmm } = this.props;
        dispatch(cardSetChangePlaceholderSize(imageFieldInfo, width / ppmm, height / ppmm));
    };

    handleRotate = (angle: number) => {
        const { dispatch, imageFieldInfo } = this.props;
        dispatch(cardSetChangePlaceholderAngle(imageFieldInfo, angle));
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
        const { dispatch, cardId, isOnBack, imageFieldInfo } = this.props;
        if (!this.wasMoved) {
            event.preventDefault();
            dispatch(cardSetActiveCardAndPlaceholder(cardId, isOnBack, imageFieldInfo.id));
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
            const { cardId, imageFieldInfo, dispatch } = this.props;
            let img = new Image();

            img.addEventListener('load', function() {
                const ii: ImageInfo = {
                    url: url.substr(imagefilesPos),
                    width: this.naturalWidth,
                    height: this.naturalHeight,
                };
                dispatch(cardSetChangeImage(cardId, imageFieldInfo.id, ii));
            });
            img.src = url;
        }
    };

    render() {
        const { imageFieldInfo, imageUrl, ppmm, cardWidth, cardHeight, imageWidth, imageHeight } = this.props;

        let calculatedImageWidth, calculatedImageHeight;
        if (!imageFieldInfo.fit || imageFieldInfo.fit === 'width') {
            calculatedImageWidth = imageFieldInfo.width * ppmm;
            calculatedImageHeight = ((imageFieldInfo.width * imageHeight) / imageWidth) * ppmm;
        } else if (imageFieldInfo.fit === 'height') {
            calculatedImageWidth = ((imageFieldInfo.height * imageWidth) / imageHeight) * ppmm;
            calculatedImageHeight = imageFieldInfo.height * ppmm;
        } else {
            // strech
            calculatedImageWidth = imageFieldInfo.width * ppmm;
            calculatedImageHeight = imageFieldInfo.height * ppmm;
        }

        calculatedImageWidth *= imageFieldInfo.zoom || 1;
        calculatedImageHeight *= imageFieldInfo.zoom || 1;

        return (
            <FieldController
                cardId={this.props.cardId}
                placeholderId={imageFieldInfo.id}
                x={imageFieldInfo.x * ppmm}
                y={imageFieldInfo.y * ppmm}
                width={imageFieldInfo.width * ppmm}
                height={imageFieldInfo.height * ppmm}
                cx={(imageFieldInfo.cx || 0) * ppmm}
                cy={(imageFieldInfo.cy || 0) * ppmm}
                zoom={imageFieldInfo.zoom || 1}
                angle={imageFieldInfo.angle}
                onDrag={this.handleDrag}
                onPan={this.handlePan}
                onZoom={this.handleZoom}
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
                        position: 'relative',
                        overflow: imageFieldInfo.crop ? 'hidden' : 'visible',
                    }}
                    onDragOver={this.handleDragOver}
                    onDragLeave={this.handleDragLeave}
                    onDrop={this.handleDrop}
                >
                    <img
                        style={{
                            position: 'absolute',
                            opacity: imageUrl && imageUrl.length > 0 ? 1 : 0.5,
                            left: (imageFieldInfo.cx || 0) * ppmm,
                            top: (imageFieldInfo.cy || 0) * ppmm,
                            width: calculatedImageWidth,
                            height: calculatedImageHeight,
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
    let imageUrl: string | undefined = '';
    let imageWidth = 1;
    let imageHeight = 1;
    if (props.imageFieldInfo && props.imageFieldInfo.type === 'image') {
        if (props.imageFieldInfo.base64) {
            imageUrl = 'data:image/svg+xml;base64,' + props.imageFieldInfo.base64;
        } else {
            imageUrl = props.imageFieldInfo && props.imageFieldInfo.url;
        }
        imageWidth = props.imageFieldInfo.width || 1;
        imageHeight = props.imageFieldInfo.height || 1;
    }

    return {
        imageUrl,
        imageWidth,
        imageHeight,
    };
};

export default connect<StateProps, DispatchProps, OwnProps, State>(mapStateToProps)(ImageField);
