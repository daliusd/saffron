import { connect } from 'react-redux';
import React, { PureComponent } from 'react';

import {
    Dispatch,
    cardSetActiveCardAndPlaceholder,
    cardSetChangeImage,
    cardSetChangeFieldPosition,
    cardSetChangeFieldAngle,
    cardSetChangeFieldPan,
    cardSetChangeFieldZoom,
    cardSetChangeFieldSize,
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

interface LocalState {
    dragIsOver: boolean;
    wasMoved: boolean;
}

class ImageField extends PureComponent<Props, LocalState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            dragIsOver: false,
            wasMoved: false,
        };
    }

    handleDrag = (x: number, y: number, cardOnly: boolean) => {
        const { dispatch, cardId, imageFieldInfo, ppmm } = this.props;
        dispatch(cardSetChangeFieldPosition(cardOnly ? cardId : undefined, imageFieldInfo.id, x / ppmm, y / ppmm));
    };

    handlePan = (cx: number, cy: number, cardOnly: boolean) => {
        const { dispatch, cardId, imageFieldInfo, ppmm } = this.props;
        dispatch(cardSetChangeFieldPan(cardOnly ? cardId : undefined, imageFieldInfo.id, cx / ppmm, cy / ppmm));
    };

    handleZoom = (zoom: number, cardOnly: boolean) => {
        const { dispatch, cardId, imageFieldInfo } = this.props;
        dispatch(cardSetChangeFieldZoom(cardOnly ? cardId : undefined, imageFieldInfo.id, zoom));
    };

    handleResize = (width: number, height: number, cardOnly: boolean) => {
        const { dispatch, imageFieldInfo, cardId, ppmm } = this.props;
        dispatch(cardSetChangeFieldSize(cardOnly ? cardId : undefined, imageFieldInfo.id, width / ppmm, height / ppmm));
    };

    handleRotate = (angle: number, cardOnly: boolean) => {
        const { dispatch, cardId, imageFieldInfo } = this.props;
        dispatch(cardSetChangeFieldAngle(cardOnly ? cardId : undefined, imageFieldInfo.id, angle));
    };

    handleMouseDown = (event: React.MouseEvent) => {
        this.setState({ wasMoved: false });
        event.preventDefault();
    };

    handleTouchStart = (event: React.TouchEvent) => {
        this.setState({ wasMoved: false });
        event.preventDefault();
    };

    handleMouseMove = (event: React.MouseEvent) => {
        this.setState({ wasMoved: true });
        event.preventDefault();
    };

    handleTouchMove = (event: React.TouchEvent) => {
        this.setState({ wasMoved: true });
        event.preventDefault();
    };

    handleMouseUp = (event: React.MouseEvent) => {
        this.handleComplete(event);
    };

    handleTouchEnd = (event: React.TouchEvent) => {
        this.handleComplete(event);
    };

    handleComplete = (event: React.MouseEvent | React.TouchEvent) => {
        const { dispatch, cardId, isOnBack, imageFieldInfo } = this.props;
        if (!this.state.wasMoved) {
            event.preventDefault();
            dispatch(cardSetActiveCardAndPlaceholder(cardId, isOnBack, imageFieldInfo.id));
        }
    };

    handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        this.setState({ dragIsOver: true });
        event.preventDefault();
        event.stopPropagation();
    };

    handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        this.setState({ dragIsOver: false });
        event.preventDefault();
        event.stopPropagation();
    };

    handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        this.setState({ dragIsOver: false });
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
                    style={{
                        width: '100%',
                        height: '100%',
                        position: 'relative',
                        overflow: imageFieldInfo.crop ? 'hidden' : 'visible',
                    }}
                    className={this.state.dragIsOver ? style.over : ''}
                    onMouseDown={this.handleMouseDown}
                    onTouchStart={this.handleTouchStart}
                    onMouseMove={this.handleMouseMove}
                    onTouchMove={this.handleTouchMove}
                    onMouseUp={this.handleMouseUp}
                    onTouchEnd={this.handleTouchEnd}
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
        imageWidth = props.imageFieldInfo.imageWidth || 1;
        imageHeight = props.imageFieldInfo.imageHeight || 1;
    }

    return {
        imageUrl,
        imageWidth,
        imageHeight,
    };
};

export default connect<StateProps, DispatchProps, OwnProps, State>(mapStateToProps)(ImageField);
