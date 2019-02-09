import { connect } from 'react-redux';
import React, { PureComponent } from 'react';

import {
    Dispatch,
    TextPlaceholderType,
    cardSetChangePlaceholderAngle,
    cardSetChangePlaceholderPosition,
    cardSetChangePlaceholderSize,
} from '../actions';
import ContentEditable from './ContentEditable';
import FieldController from './FieldController';

interface Props {
    cardId: string;
    textPlaceholder: TextPlaceholderType;
    dispatch: Dispatch;
    ppmm: number;
}

class TextField extends PureComponent<Props> {
    handleDrag = (x: number, y: number) => {
        const { dispatch, textPlaceholder, ppmm } = this.props;
        dispatch(cardSetChangePlaceholderPosition(textPlaceholder, x / ppmm, y / ppmm));
    };

    handleResize = (width: number, height: number) => {
        const { dispatch, textPlaceholder, ppmm } = this.props;
        dispatch(cardSetChangePlaceholderSize(textPlaceholder, width / ppmm, height / ppmm));
    };

    handleRotate = (angle: number) => {
        const { dispatch, textPlaceholder } = this.props;
        dispatch(cardSetChangePlaceholderAngle(textPlaceholder, angle));
    };

    render() {
        const { textPlaceholder, ppmm } = this.props;

        return (
            <FieldController
                cardId={this.props.cardId}
                placeholderId={textPlaceholder.id}
                x={textPlaceholder.x * ppmm}
                y={textPlaceholder.y * ppmm}
                width={textPlaceholder.width * ppmm}
                height={textPlaceholder.height * ppmm}
                angle={textPlaceholder.angle}
                onDrag={this.handleDrag}
                onResize={this.handleResize}
                onRotate={this.handleRotate}
            >
                <ContentEditable
                    cardId={this.props.cardId}
                    placeholderId={textPlaceholder.id}
                    align={textPlaceholder.align}
                    color={textPlaceholder.color}
                    fontFamily={textPlaceholder.fontFamily}
                    fontVariant={textPlaceholder.fontVariant}
                    fontSize={textPlaceholder.fontSize * ppmm}
                />
            </FieldController>
        );
    }
}

export default connect()(TextField);
