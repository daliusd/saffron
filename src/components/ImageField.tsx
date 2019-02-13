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
import ImageSelectionDialog from './ImageSelectionDialog';

interface OwnProps {
    cardId: string;
    ppmm: number;
    imagePlaceholder: ImagePlaceholderType;
}

interface StateProps {
    imageUrl: string;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & StateProps & DispatchProps;

interface LocalState {
    imageSelectionDialogIsOpen: boolean;
}

class ImageField extends PureComponent<Props, LocalState> {
    imageDiv: React.RefObject<HTMLDivElement>;
    wasMoved: boolean;

    state = {
        imageSelectionDialogIsOpen: false,
    };

    constructor(props: Props) {
        super(props);
        this.imageDiv = React.createRef();
        this.wasMoved = false;
    }

    componentDidMount() {
        if (!this.imageDiv.current) return;
        this.imageDiv.current.addEventListener('mousedown', this.handleMouseDown);
        this.imageDiv.current.addEventListener('mousemove', this.handleMouseMove);
        this.imageDiv.current.addEventListener('mouseup', this.handleMouseUp);
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

    handleImageSelectionDialogClose = () => {
        this.setState({ imageSelectionDialogIsOpen: false });
    };

    handleMouseDown = (event: MouseEvent) => {
        this.wasMoved = false;
        event.preventDefault();
    };

    handleMouseMove = (event: MouseEvent) => {
        this.wasMoved = true;
        event.preventDefault();
    };

    handleMouseUp = (event: MouseEvent) => {
        const { dispatch, cardId, imagePlaceholder } = this.props;
        if (!this.wasMoved) {
            event.preventDefault();
            dispatch(cardSetActiveCardAndPlaceholder(cardId, imagePlaceholder.id));

            this.setState({ imageSelectionDialogIsOpen: true });
        }
    };

    render() {
        const { imagePlaceholder, imageUrl, ppmm } = this.props;

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
            >
                <div
                    ref={this.imageDiv}
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                >
                    <img src={imageUrl} alt="" />
                </div>
                <ImageSelectionDialog
                    imageUrl={imageUrl}
                    cardId={this.props.cardId}
                    placeholder={imagePlaceholder}
                    onClose={this.handleImageSelectionDialogClose}
                    isOpen={this.state.imageSelectionDialogIsOpen}
                />
            </FieldController>
        );
    }
}

const mapStateToProps = (state: State, props: OwnProps): StateProps => {
    const imageUrl =
        state.cardsets.images &&
        state.cardsets.images[props.cardId] &&
        state.cardsets.images[props.cardId][props.imagePlaceholder.id]
            ? state.cardsets.images[props.cardId][props.imagePlaceholder.id].url
            : '';
    return {
        imageUrl,
    };
};

export default connect<StateProps, DispatchProps, OwnProps, State>(mapStateToProps)(ImageField);
