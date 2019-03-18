import { connect } from 'react-redux';
import React, { PureComponent } from 'react';

import {
    Dispatch,
    ImagePlaceholderType,
    cardSetActiveCardAndPlaceholder,
    cardSetChangePlaceholderAngle,
    cardSetChangePlaceholderPosition,
    cardSetChangePlaceholderSize,
} from '../actions';
import { State } from '../reducers';
import FieldController from './FieldController';
import emptyImageImage from './image.svg';

interface OwnProps {
    cardId: string;
    ppmm: number;
    imagePlaceholder: ImagePlaceholderType;
    cardWidth: number;
    cardHeight: number;
}

interface StateProps {
    imageUrl: string;
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
        const { dispatch, cardId, imagePlaceholder } = this.props;
        if (!this.wasMoved) {
            event.preventDefault();
            dispatch(cardSetActiveCardAndPlaceholder(cardId, imagePlaceholder.id));
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
            >
                <div
                    ref={this.imageDiv}
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                >
                    <img
                        style={{
                            opacity: imageUrl.length > 0 ? 1 : 0.5,
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

    let imageUrl = '';
    if (imageInfo) {
        if (imageInfo.base64) {
            imageUrl = 'data:image/svg+xml;base64,' + imageInfo.base64;
        } else {
            imageUrl = imageInfo.url;
        }
    }

    return {
        imageUrl,
    };
};

export default connect<StateProps, DispatchProps, OwnProps, State>(mapStateToProps)(ImageField);
