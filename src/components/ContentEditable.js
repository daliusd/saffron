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
    currentCursor: number;
    timeout: ?TimeoutID;

    constructor(props: Props) {
        super();
        this.editDiv = React.createRef();
        this.currentText = '';
        this.timeout = null;
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
        this.currentCursor = textCursor;
        if (textCursor) {
            const range = document.createRange();
            const textContent = this.editDiv.current.childNodes[0].textContent;
            if (textContent && textContent.length >= textCursor) {
                range.setStart(this.editDiv.current.childNodes[0], textCursor);
                range.setEnd(this.editDiv.current.childNodes[0], textCursor);
            }
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }
    };

    getCursor = () => {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        return range.startOffset;
    };

    onBlur = () => {
        const value = this.editDiv.current.innerText;
        const cursor = this.getCursor();

        if (value !== this.currentText || cursor !== this.currentCursor) {
            this.currentText = value;

            if (this.timeout) {
                clearTimeout(this.timeout);
            }

            this.timeout = setTimeout(() => {
                const { dispatch, textId } = this.props;
                const textInfo: TextInfo = { value, cursor };

                dispatch(cardSetChangeText(textId, textInfo));
            }, 500);
        }
    };

    render() {
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
