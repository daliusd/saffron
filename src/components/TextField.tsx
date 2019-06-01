import { connect } from 'react-redux';
import React, { PureComponent } from 'react';

import { DEFAULT_LINE_HEIGHT } from '../constants';
import { Dispatch, cardSetChangeFieldAngle, cardSetChangeFieldPosition, cardSetChangeFieldSize } from '../actions';
import { State } from '../reducers';
import { TextFieldInfo } from '../types';
import ContentEditable from './ContentEditable';
import FieldController from './FieldController';
import emptyTextImage from './text.svg';

interface OwnProps {
    cardId: string;
    isOnBack: boolean;
    ppmm: number;
    textFieldInfo: TextFieldInfo;
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
    handleDrag = (x: number, y: number, cardOnly: boolean) => {
        const { dispatch, cardId, textFieldInfo, ppmm } = this.props;
        dispatch(cardSetChangeFieldPosition(cardOnly ? cardId : undefined, textFieldInfo.id, x / ppmm, y / ppmm));
    };

    handleResize = (width: number, height: number, cardOnly: boolean) => {
        const { dispatch, textFieldInfo, cardId, ppmm } = this.props;
        dispatch(cardSetChangeFieldSize(cardOnly ? cardId : undefined, textFieldInfo.id, width / ppmm, height / ppmm));
    };

    handleRotate = (angle: number, cardOnly: boolean) => {
        const { dispatch, textFieldInfo, cardId } = this.props;
        dispatch(cardSetChangeFieldAngle(cardOnly ? cardId : undefined, textFieldInfo.id, angle));
    };

    render() {
        const { textFieldInfo, text, ppmm, cardWidth, cardHeight } = this.props;

        return (
            <FieldController
                cardId={this.props.cardId}
                placeholderId={textFieldInfo.id}
                x={textFieldInfo.x * ppmm}
                y={textFieldInfo.y * ppmm}
                width={textFieldInfo.width * ppmm}
                height={textFieldInfo.height * ppmm}
                angle={textFieldInfo.angle}
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
                                textFieldInfo.align === 'left'
                                    ? 'left'
                                    : textFieldInfo.align === 'right'
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
                    placeholderId={textFieldInfo.id}
                    align={textFieldInfo.align}
                    color={textFieldInfo.color}
                    fontFamily={textFieldInfo.fontFamily}
                    fontVariant={textFieldInfo.fontVariant}
                    fontSize={textFieldInfo.fontSize * ppmm}
                    lineHeight={textFieldInfo.lineHeight || DEFAULT_LINE_HEIGHT}
                />
            </FieldController>
        );
    }
}

const mapStateToProps = (state: State, props: OwnProps): StateProps => {
    let fieldInfo = state.cardset.fields[props.cardId][props.textFieldInfo.id];
    let text = fieldInfo.type === 'text' ? fieldInfo.value : '';
    return {
        text,
    };
};

export default connect<StateProps, DispatchProps, OwnProps, State>(mapStateToProps)(TextField);
