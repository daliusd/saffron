// @flow
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { connect } from 'react-redux';
import { PureComponent } from 'react';

import {
    type Dispatch,
    type ImagePlaceholderType,
    cardSetActiveCardAndPlaceholder,
    cardSetChangePlaceholderAngle,
    cardSetChangePlaceholderPosition,
    cardSetChangePlaceholderSize,
} from '../actions';
import FieldController from './FieldController';

type Props = {
    cardId: string,
    imagePlaceholder: ImagePlaceholderType,
    dispatch: Dispatch,
};

class TextField extends PureComponent<Props> {
    handleDrag = (x: number, y: number) => {
        const { dispatch, imagePlaceholder } = this.props;
        dispatch(cardSetChangePlaceholderPosition(imagePlaceholder, x, y));
    };

    handleResize = (width: number, height: number) => {
        const { dispatch, imagePlaceholder } = this.props;
        dispatch(cardSetChangePlaceholderSize(imagePlaceholder, width, height));
    };

    handleRotate = (angle: number) => {
        const { dispatch, imagePlaceholder } = this.props;
        dispatch(cardSetChangePlaceholderAngle(imagePlaceholder, angle));
    };

    handleClick = () => {
        const { dispatch, cardId, imagePlaceholder } = this.props;
        dispatch(cardSetActiveCardAndPlaceholder(cardId, imagePlaceholder.id));
    };

    render() {
        const { imagePlaceholder } = this.props;

        return (
            <FieldController
                cardId={this.props.cardId}
                placeholderId={imagePlaceholder.id}
                x={imagePlaceholder.x}
                y={imagePlaceholder.y}
                width={imagePlaceholder.width}
                height={imagePlaceholder.height}
                angle={imagePlaceholder.angle}
                onDrag={this.handleDrag}
                onResize={this.handleResize}
                onRotate={this.handleRotate}
            >
                <img
                    src={imagePlaceholder.url}
                    alt=""
                    onClick={this.handleClick}
                    css={{
                        filter: 'invert(1)',
                    }}
                />
            </FieldController>
        );
    }
}

export default connect()(TextField);
