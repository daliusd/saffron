// @flow
import { connect } from 'react-redux';
import React, { type ElementRef, PureComponent } from 'react';

import { type Dispatch, type TextInfo, cardSetChangeText } from '../actions';

type Props = {
    dispatch: Dispatch,
    textId: string,
    textValue: string,
    textCursor: number,
};

class ContentEditable extends PureComponent<Props> {
    editDiv: ElementRef<any>;
    cursorPos: number;
    currentText: string;

    constructor(props: Props) {
        super();
        this.editDiv = React.createRef();
        this.cursorPos = 0;
        this.currentText = '';
    }

    onClick = () => {
        this.editDiv.current.focus();
    };

    onFocus = () => {
        const { textValue, textCursor } = this.props;
        this.currentText = textValue;
        this.cursorPos = textCursor;
        if (this.cursorPos) {
            const range = document.createRange();
            range.setStart(this.editDiv.current.childNodes[0], this.cursorPos);
            range.setEnd(this.editDiv.current.childNodes[0], this.cursorPos);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }
    };

    onKeyUp = () => {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        this.cursorPos = range.startOffset;
    };

    onBlur = () => {
        const value = this.editDiv.current.innerText;
        if (value !== this.currentText) {
            const { dispatch, textId } = this.props;

            const textInfo: TextInfo = { value, cursor: this.cursorPos };

            dispatch(cardSetChangeText(textId, textInfo));
        }
    };

    render() {
        console.log('ContentEditable render');
        return (
            <div
                ref={this.editDiv}
                contentEditable="true"
                onClick={this.onClick}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                onKeyUp={this.onKeyUp}
                style={{
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                }}
                dangerouslySetInnerHTML={{ __html: this.props.textValue }}
            />
        );
    }
}

const mapStateToProps = (state, props) => {
    const textInfo = state.cardsets.texts[props.textId] || { value: '', cursor: 0 };
    return {
        textValue: textInfo.value,
        textCursor: textInfo.cursor,
    };
};

export default connect(mapStateToProps)(ContentEditable);
