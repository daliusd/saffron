import { connect } from 'react-redux';
import React, { PureComponent } from 'react';

import { DEFAULT_LINE_HEIGHT } from '../constants';
import {
    Dispatch,
    cardSetChangePlaceholderAngle,
    cardSetChangePlaceholderPosition,
    cardSetChangePlaceholderSize,
} from '../actions';
import { State } from '../reducers';
import { TextPlaceholderType } from '../types';
import ContentEditable from './ContentEditable';
import FieldController from './FieldController';
import emptyTextImage from './text.svg';

interface OwnProps {
    cardId: string;
    isOnBack: boolean;
    ppmm: number;
    textPlaceholder: TextPlaceholderType;
    cardWidth: number;
    cardHeight: number;
}

interface StateProps {
    text: string;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & StateProps & DispatchProps;

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
        const { textPlaceholder, text, ppmm, cardWidth, cardHeight } = this.props;

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
                cardWidth={cardWidth}
                cardHeight={cardHeight}
                ppmm={ppmm}
            >
                {text === '' && (
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            position: 'fixed',
                            left: 0,
                            top: 0,
                            zIndex: -1,
                            textAlign:
                                textPlaceholder.align === 'left'
                                    ? 'left'
                                    : textPlaceholder.align === 'right'
                                    ? 'right'
                                    : 'center',
                        }}
                    >
                        <img style={{ opacity: 0.5, width: 'auto', height: '100%' }} src={emptyTextImage} alt="" />
                    </div>
                )}

                <ContentEditable
                    cardId={this.props.cardId}
                    isOnBack={this.props.isOnBack}
                    placeholderId={textPlaceholder.id}
                    align={textPlaceholder.align}
                    color={textPlaceholder.color}
                    fontFamily={textPlaceholder.fontFamily}
                    fontVariant={textPlaceholder.fontVariant}
                    fontSize={textPlaceholder.fontSize * ppmm}
                    lineHeight={textPlaceholder.lineHeight || DEFAULT_LINE_HEIGHT}
                />
            </FieldController>
        );
    }
}

const mapStateToProps = (state: State, props: OwnProps): StateProps => {
    let text =
        state.cardsets.texts &&
        state.cardsets.texts[props.cardId] &&
        state.cardsets.texts[props.cardId][props.textPlaceholder.id]
            ? state.cardsets.texts[props.cardId][props.textPlaceholder.id].value
            : '';
    return {
        text,
    };
};

export default connect<StateProps, DispatchProps, OwnProps, State>(mapStateToProps)(TextField);
