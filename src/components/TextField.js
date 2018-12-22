// @flow
import { connect } from 'react-redux';
import React, { PureComponent } from 'react';

import {
    type Dispatch,
    type TextTemplateType,
    cardSetChangeTextTemplateAngle,
    cardSetChangeTextTemplatePosition,
    cardSetChangeTextTemplateSize,
} from '../actions';
import ContentEditable from './ContentEditable';
import FieldController from './FieldController';

type Props = {
    cardId: string,
    textTemplate: TextTemplateType,
    dispatch: Dispatch,
};

class TextField extends PureComponent<Props> {
    handleDrag = (x: number, y: number) => {
        const { dispatch, textTemplate } = this.props;
        dispatch(cardSetChangeTextTemplatePosition(textTemplate, x, y));
    };

    handleResize = (width: number, height: number) => {
        const { dispatch, textTemplate } = this.props;
        dispatch(cardSetChangeTextTemplateSize(textTemplate, width, height));
    };

    handleRotate = (angle: number) => {
        const { dispatch, textTemplate } = this.props;
        dispatch(cardSetChangeTextTemplateAngle(textTemplate, angle));
    };

    render() {
        const { textTemplate } = this.props;

        return (
            <FieldController
                x={textTemplate.x}
                y={textTemplate.y}
                width={textTemplate.width}
                height={textTemplate.height}
                angle={textTemplate.angle}
                onDrag={this.handleDrag}
                onResize={this.handleResize}
                onRotate={this.handleRotate}
            >
                <ContentEditable
                    cardId={this.props.cardId}
                    templateId={textTemplate.id}
                    align={textTemplate.align}
                />
            </FieldController>
        );
    }
}

export default connect()(TextField);
