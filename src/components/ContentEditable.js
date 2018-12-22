// @flow
import { connect } from 'react-redux';
import React, { type ElementRef, Component } from 'react';

import { type Dispatch, type TextInfo, cardSetActiveTemplate, cardSetChangeText } from '../actions';

type Props = {
    dispatch: Dispatch,
    cardId: string,
    templateId: string,
    textValue: string,
    textCursor: number,
    align: string,
};

class ContentEditable extends Component<Props> {
    editDiv: ElementRef<any>;
    currentText: string;
    currentAlign: string;
    currentCursor: number;
    timeout: ?TimeoutID;

    constructor(props: Props) {
        super();
        this.editDiv = React.createRef();
        this.currentText = '';
        this.currentAlign = '';
        this.currentCursor = 0;
        this.timeout = null;
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.textValue !== this.currentText || nextProps.align !== this.currentAlign;
    }

    onClick = () => {
        const { dispatch, templateId } = this.props;

        this.editDiv.current.focus();
        dispatch(cardSetActiveTemplate(templateId));
    };

    onFocus = () => {
        const { textValue, textCursor, align } = this.props;
        this.currentText = textValue;
        this.currentAlign = align;
        this.currentCursor = textCursor;
        if (textCursor) {
            const range = document.createRange();
            const textContent =
                this.editDiv.current.childNodes.length > 0 ? this.editDiv.current.childNodes[0].textContent : null;
            if (textContent && textContent.length >= textCursor) {
                range.setStart(this.editDiv.current.childNodes[0], textCursor);
                range.setEnd(this.editDiv.current.childNodes[0], textCursor);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    };

    getCursor = () => {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        return range.startOffset;
    };

    updateContent = () => {
        const value = this.editDiv.current.innerText;

        if (value !== this.currentText) {
            const cursor = this.getCursor();

            this.currentText = value;
            this.currentCursor = cursor;

            if (this.timeout) {
                clearTimeout(this.timeout);
            }

            this.timeout = setTimeout(() => {
                const { dispatch, cardId, templateId } = this.props;
                const textInfo: TextInfo = { value, cursor };

                dispatch(cardSetChangeText(cardId, templateId, textInfo));
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
                onBlur={this.updateContent}
                onInput={this.updateContent}
                style={{
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                    textAlign: this.props.align || 'left',
                }}
                dangerouslySetInnerHTML={{ __html: this.props.textValue }}
            />
        );
    }
}

const mapStateToProps = (state, props) => {
    const textInfo =
        state.cardsets.texts[props.cardId] && state.cardsets.texts[props.cardId][props.templateId]
            ? state.cardsets.texts[props.cardId][props.templateId]
            : { value: '', cursor: 0 };
    return {
        textValue: textInfo.value,
        textCursor: textInfo.cursor,
    };
};

export default connect(mapStateToProps)(ContentEditable);
