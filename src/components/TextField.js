// @flow
import { connect } from 'react-redux';
import React, { Component } from 'react';

import { type CardSetType, type Dispatch, type TextTemplateType, cardSetUpdateData } from '../actions';
import { getActiveCardSet } from '../selectors';
import FieldController from './FieldController';

type Props = {
    card_id: string,
    textTemplate: TextTemplateType,
    activeCardSet: CardSetType,
    dispatch: Dispatch,
};

class TextField extends Component<Props> {
    handleSelect = () => {
        console.log('select');
    };

    handleDrag = (x: number, y: number) => {
        const { dispatch, activeCardSet, textTemplate } = this.props;

        let cardset = Object.assign({}, activeCardSet);

        cardset.data.template.texts[textTemplate.id].x = x;
        cardset.data.template.texts[textTemplate.id].y = y;

        dispatch(cardSetUpdateData(cardset));
    };

    handleResize = (width: number, height: number) => {
        const { dispatch, activeCardSet, textTemplate } = this.props;

        let cardset = Object.assign({}, activeCardSet);

        cardset.data.template.texts[textTemplate.id].width = width;
        cardset.data.template.texts[textTemplate.id].height = height;

        dispatch(cardSetUpdateData(cardset));
    };

    handleRotate = (angle: number) => {
        const { dispatch, activeCardSet, textTemplate } = this.props;

        let cardset = Object.assign({}, activeCardSet);

        cardset.data.template.texts[textTemplate.id].angle = angle;

        dispatch(cardSetUpdateData(cardset));
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
                onSelect={this.handleSelect}
                onDrag={this.handleDrag}
                onResize={this.handleResize}
                onRotate={this.handleRotate}
            >
                Text
            </FieldController>
        );
    }
}

const mapStateToProps = state => {
    return {
        activeCardSet: getActiveCardSet(state),
    };
};

export default connect(mapStateToProps)(TextField);
