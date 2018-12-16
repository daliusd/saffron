// @flow
import { connect } from 'react-redux';
import React, { Component } from 'react';

import { type CardSetType, type Dispatch, type TextTemplateType } from '../actions';
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
        console.log(`drag ${y}:${x}`);
    };

    handleResize = (width: number, height: number) => {
        console.log(`resize ${width} ${height}`);
    };

    handleRotate = (angle: number) => {
        console.log(`rotate ${angle}`);
    };

    render() {
        const { textTemplate } = this.props;

        return (
            <FieldController
                x={textTemplate.x}
                y={textTemplate.y}
                width={textTemplate.width}
                height={textTemplate.height}
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
