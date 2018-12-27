// @flow
import { connect } from 'react-redux';
import React, { type ElementRef, Component } from 'react';

import { type Dispatch, type TextInfo, cardSetActiveCardAndPlaceholder, cardSetChangeText } from '../actions';

type Props = {
    dispatch: Dispatch,
    cardId: string,
    placeholderId: string,
    textValue: string,
    textCursor: number,
    align: string,
    isActive: boolean,
};

class ContentEditable extends Component<Props> {
    editDiv: ElementRef<any>;
    currentText: string;
    currentAlign: string;
    currentCursor: number;
    timeout: ?TimeoutID;
    wasMoved: boolean;

    constructor(props: Props) {
        super();
        this.editDiv = React.createRef();
        this.currentText = '';
        this.currentAlign = '';
        this.currentCursor = 0;
        this.timeout = null;
        this.wasMoved = false;
    }

    componentDidMount() {
        const { isActive } = this.props;

        this.editDiv.current.addEventListener('mousedown', this.handleMouseDown);
        this.editDiv.current.addEventListener('mousemove', this.handleMouseMove);
        this.editDiv.current.addEventListener('mouseup', this.handleMouseUp);

        if (isActive) {
            this.editDiv.current.focus();
        }
    }

    componentDidUpdate() {
        const { isActive } = this.props;

        if (isActive) {
            this.editDiv.current.focus();
        }
    }

    shouldComponentUpdate(nextProps) {
        return (
            nextProps.textValue !== this.currentText ||
            nextProps.align !== this.currentAlign ||
            this.props.isActive !== nextProps.isActive
        );
    }

    handleMouseDown = (event: MouseEvent) => {
        const { isActive } = this.props;
        if (isActive) {
            event.stopPropagation();
        } else {
            this.wasMoved = false;
            event.preventDefault();
        }
    };

    handleMouseMove = (event: MouseEvent) => {
        const { isActive } = this.props;
        if (isActive) {
            event.stopPropagation();
        } else {
            this.wasMoved = true;
            event.preventDefault();
        }
    };

    handleMouseUp = (event: MouseEvent) => {
        const { dispatch, cardId, placeholderId, isActive } = this.props;
        if (isActive) {
            event.stopPropagation();
        } else if (!this.wasMoved) {
            event.preventDefault();
            dispatch(cardSetActiveCardAndPlaceholder(cardId, placeholderId));
        }
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

    updateContent = timeout_in_miliseconds => {
        const value = this.editDiv.current.innerText;

        if (value !== this.currentText) {
            const cursor = this.getCursor();

            this.currentText = value;
            this.currentCursor = cursor;

            if (this.timeout) {
                clearTimeout(this.timeout);
            }

            this.timeout = setTimeout(() => {
                const { dispatch, cardId, placeholderId } = this.props;
                const textInfo: TextInfo = { value, cursor };

                dispatch(cardSetChangeText(cardId, placeholderId, textInfo));
            }, timeout_in_miliseconds);
        }
    };

    handleBlur = () => {
        this.updateContent(0);
    };

    handleInput = () => {
        this.updateContent(500);
    };

    render() {
        return (
            <div
                ref={this.editDiv}
                contentEditable="true"
                onFocus={this.onFocus}
                onBlur={this.handleBlur}
                onInput={this.handleInput}
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
        state.cardsets.texts &&
        state.cardsets.texts[props.cardId] &&
        state.cardsets.texts[props.cardId][props.placeholderId]
            ? state.cardsets.texts[props.cardId][props.placeholderId]
            : { value: '', cursor: 0 };
    return {
        textValue: textInfo.value,
        textCursor: textInfo.cursor,
        isActive:
            props.cardId === state.cardsets.activeCard && props.placeholderId === state.cardsets.activePlaceholder,
    };
};

export default connect(mapStateToProps)(ContentEditable);
