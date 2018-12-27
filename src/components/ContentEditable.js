/** @jsx jsx */
// @flow
import { jsx } from '@emotion/core';
import { connect } from 'react-redux';
import React, { type ElementRef, Component } from 'react';

import { DEFAULT_FONT } from '../fontLoader';
import { type Dispatch, type TextInfo, cardSetActiveCardAndPlaceholder, cardSetChangeText } from '../actions';

type Props = {
    dispatch: Dispatch,
    cardId: string,
    placeholderId: string,
    textValue: string,
    align: string,
    color: string,
    fontFamily: string,
    fontVariant: string,
    isActive: boolean,
};

class ContentEditable extends Component<Props> {
    editDiv: ElementRef<any>;
    currentText: string;
    currentAlign: string;
    currentColor: string;
    currentFontFamily: string;
    currentFontVariant: string;
    timeout: ?TimeoutID;
    wasMoved: boolean;

    constructor(props: Props) {
        super();
        this.editDiv = React.createRef();
        this.currentText = '';
        this.currentAlign = '';
        this.currentColor = '';
        this.currentFontFamily = '';
        this.currentFontVariant = '';
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
            nextProps.color !== this.currentColor ||
            nextProps.fontFamily !== this.currentFontFamily ||
            nextProps.fontVariant !== this.currentFontVariant ||
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
        const { textValue, align, color, fontFamily, fontVariant } = this.props;
        this.currentText = textValue;
        this.currentAlign = align;
        this.currentColor = color;
        this.currentFontFamily = fontFamily;
        this.currentFontVariant = fontVariant;

        const range = document.createRange();
        range.selectNodeContents(this.editDiv.current);
        range.collapse(false);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    };

    updateContent = timeout_in_miliseconds => {
        const value = this.editDiv.current.innerHTML;

        if (value !== this.currentText) {
            this.currentText = value;

            if (this.timeout) {
                clearTimeout(this.timeout);
            }

            this.timeout = setTimeout(() => {
                const { dispatch, cardId, placeholderId } = this.props;
                const textInfo: TextInfo = { value };

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
        const { color, align, fontFamily, fontVariant } = this.props;
        const isItalic = fontVariant && fontVariant.indexOf('italic') !== -1;
        const fontWeight = isItalic
            ? fontVariant === 'italic'
                ? 400
                : parseInt(fontVariant.slice(0, 3))
            : fontVariant === 'regular'
                ? 400
                : parseInt(fontVariant);

        return (
            <div
                ref={this.editDiv}
                contentEditable="true"
                onFocus={this.onFocus}
                onBlur={this.handleBlur}
                onInput={this.handleInput}
                css={{
                    width: '100%',
                    height: '100%',
                    textAlign: align || 'left',
                    color: color,
                    fontFamily: `'${fontFamily}'` || DEFAULT_FONT,
                    fontStyle: isItalic ? 'italic' : 'normal',
                    fontWeight,
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
            : { value: '' };
    return {
        textValue: textInfo.value,
        isActive:
            props.cardId === state.cardsets.activeCard && props.placeholderId === state.cardsets.activePlaceholder,
    };
};

export default connect(mapStateToProps)(ContentEditable);
