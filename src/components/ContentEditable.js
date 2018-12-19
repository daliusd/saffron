// @flow
import { connect } from 'react-redux';
import React, { type ElementRef, Component } from 'react';

import { type Dispatch, type TextInfo, cardSetChangeText } from '../actions';

type Props = {
    dispatch: Dispatch,
    textId: string,
    textValue: string,
    textCursor: number,
};

class ContentEditable extends Component<Props> {
    editDiv: ElementRef<any>;
    currentText: string;

    constructor(props: Props) {
        super();
        this.editDiv = React.createRef();
        this.currentText = '';
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.textValue !== this.currentText;
    }

    onClick = () => {
        this.editDiv.current.focus();
    };

    onFocus = () => {
        const { textValue, textCursor } = this.props;
        this.currentText = textValue;
        if (textCursor) {
            const range = document.createRange();
            range.setStart(this.editDiv.current.childNodes[0], textCursor);
            range.setEnd(this.editDiv.current.childNodes[0], textCursor);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }
    };

    onBlur = () => {
        const value = this.editDiv.current.innerText;
        if (value !== this.currentText) {
            const { dispatch, textId } = this.props;

            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            const cursor = range.startOffset;

            const textInfo: TextInfo = { value, cursor };

            dispatch(cardSetChangeText(textId, textInfo));

            this.currentText = value;
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
                onInput={this.onBlur}
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
