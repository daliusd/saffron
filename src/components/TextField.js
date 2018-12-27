// @flow
import { connect } from 'react-redux';
import React, { PureComponent } from 'react';

import {
    type Dispatch,
    type TextPlaceholderType,
    cardSetChangeTextPlaceholderAngle,
    cardSetChangeTextPlaceholderPosition,
    cardSetChangeTextPlaceholderSize,
} from '../actions';
import ContentEditable from './ContentEditable';
import FieldController from './FieldController';

type Props = {
    cardId: string,
    textPlaceholder: TextPlaceholderType,
    dispatch: Dispatch,
};

class TextField extends PureComponent<Props> {
    handleDrag = (x: number, y: number) => {
        const { dispatch, textPlaceholder } = this.props;
        dispatch(cardSetChangeTextPlaceholderPosition(textPlaceholder, x, y));
    };

    handleResize = (width: number, height: number) => {
        const { dispatch, textPlaceholder } = this.props;
        dispatch(cardSetChangeTextPlaceholderSize(textPlaceholder, width, height));
    };

    handleRotate = (angle: number) => {
        const { dispatch, textPlaceholder } = this.props;
        dispatch(cardSetChangeTextPlaceholderAngle(textPlaceholder, angle));
    };

    render() {
        const { textPlaceholder } = this.props;

        return (
            <FieldController
                x={textPlaceholder.x}
                y={textPlaceholder.y}
                width={textPlaceholder.width}
                height={textPlaceholder.height}
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
                />
            </FieldController>
        );
    }
}

export default connect()(TextField);
