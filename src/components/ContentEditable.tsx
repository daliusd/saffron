import { connect } from 'react-redux';
import React, { Component } from 'react';

import { DEFAULT_FONT, DEFAULT_FONT_SIZE, DEFAULT_LINE_HEIGHT } from '../constants';
import { Dispatch, cardSetActiveCardAndField, cardSetChangeText } from '../actions';
import { State } from '../reducers';
import { TextInfo } from '../types';
import style from './ContentEditable.module.css';

interface OwnProps {
    cardId: string;
    isOnBack: boolean;
    fieldId: string;
    align: string;
    color: string;
    fontFamily: string;
    fontVariant: string;
    fontSize: number;
    lineHeight: number;
}

interface StateProps {
    isActive: boolean;
    textValue: string;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & StateProps & DispatchProps;

class ContentEditable extends Component<Props> {
    editDiv: React.RefObject<HTMLDivElement>;
    currentText: string;
    currentAlign: string;
    currentColor: string;
    currentFontFamily: string;
    currentFontVariant: string;
    currentFontSize: number;
    currentLineHeight: number;
    timeout: NodeJS.Timeout | null;
    wasMoved: boolean;
    x: number;
    y: number;

    constructor(props: Props) {
        super(props);
        this.editDiv = React.createRef();
        this.currentText = '';
        this.currentAlign = '';
        this.currentColor = '';
        this.currentFontFamily = '';
        this.currentFontVariant = '';
        this.currentFontSize = DEFAULT_FONT_SIZE;
        this.currentLineHeight = DEFAULT_LINE_HEIGHT;
        this.timeout = null;
        this.wasMoved = false;
        this.x = 0;
        this.y = 0;
    }

    componentDidMount() {
        const { isActive } = this.props;

        if (!this.editDiv.current) return;

        this.editDiv.current.addEventListener('mousedown', this.handleMouseDown);
        this.editDiv.current.addEventListener('touchstart', this.handleTouchStart);
        this.editDiv.current.addEventListener('mousemove', this.handleMouseMove);
        this.editDiv.current.addEventListener('touchmove', this.handleTouchMove, { passive: false });
        this.editDiv.current.addEventListener('mouseup', this.handleMouseUp);
        this.editDiv.current.addEventListener('touchend', this.handleTouchEnd, { passive: false });

        if (isActive) {
            this.editDiv.current.focus();
        }
    }

    shouldComponentUpdate(nextProps: Props) {
        const shouldUpdate =
            nextProps.textValue !== this.currentText ||
            nextProps.align !== this.currentAlign ||
            nextProps.color !== this.currentColor ||
            nextProps.fontFamily !== this.currentFontFamily ||
            nextProps.fontVariant !== this.currentFontVariant ||
            nextProps.fontSize !== this.currentFontSize ||
            nextProps.lineHeight !== this.currentLineHeight ||
            this.props.isActive !== nextProps.isActive;

        return shouldUpdate;
    }

    componentDidUpdate() {
        const { textValue, align, color, fontFamily, fontVariant, fontSize, lineHeight } = this.props;
        this.currentText = textValue;
        this.currentAlign = align;
        this.currentColor = color;
        this.currentFontFamily = fontFamily;
        this.currentFontVariant = fontVariant;
        this.currentFontSize = fontSize;
        this.currentLineHeight = lineHeight;
    }

    handleMouseDown = (event: MouseEvent) => {
        this.handleStart(event);
    };

    handleTouchStart = (event: TouchEvent) => {
        if (event.touches.length > 1) {
            return; // Let's ignore zooms
        }

        this.x = event.changedTouches[0].clientX;
        this.y = event.changedTouches[0].clientY;
        this.handleStart(event);
    };

    handleStart = (event: Event) => {
        const { isActive } = this.props;
        if (isActive) {
            event.stopPropagation();
        } else {
            this.wasMoved = false;
            event.preventDefault();
        }
    };

    handleMouseMove = (event: MouseEvent) => {
        this.handleMove(event);
    };

    handleTouchMove = (event: TouchEvent) => {
        if (event.touches.length > 1) {
            return; // Let's ignore zooms
        }

        if (
            Math.abs(event.changedTouches[0].clientX - this.x) > 3 ||
            Math.abs(event.changedTouches[0].clientY - this.y) > 3
        ) {
            this.handleMove(event);
        }
    };

    handleMove = (event: Event) => {
        const { isActive } = this.props;
        if (isActive) {
            event.stopPropagation();
        } else {
            this.wasMoved = true;
            event.preventDefault();
        }
    };

    handleMouseUp = (event: MouseEvent) => {
        this.handleComplete(event);
    };

    handleTouchEnd = (event: TouchEvent) => {
        if (event.touches.length > 1) {
            return; // Let's ignore zooms
        }

        this.handleComplete(event);
    };

    handleComplete = (event: Event) => {
        const { dispatch, cardId, isOnBack, fieldId, isActive } = this.props;
        if (isActive) {
            event.stopPropagation();
        } else if (!this.wasMoved) {
            event.preventDefault();
            dispatch(cardSetActiveCardAndField(cardId, isOnBack, fieldId));

            if (!this.editDiv.current) return;
            this.editDiv.current.focus();
        }
    };

    onFocus = () => {
        if (!this.editDiv.current) return;

        const { textValue, align, color, fontFamily, fontVariant, fontSize } = this.props;
        this.currentText = textValue;
        this.currentAlign = align;
        this.currentColor = color;
        this.currentFontFamily = fontFamily;
        this.currentFontVariant = fontVariant;
        this.currentFontSize = fontSize;

        const range = document.createRange();
        range.selectNodeContents(this.editDiv.current);
        range.collapse(false);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    };

    updateContent = (timeoutInMiliseconds: number) => {
        if (!this.editDiv.current) return;
        let value = this.editDiv.current.innerHTML;

        let imgUrlIdx = -1;
        while ((imgUrlIdx = value.indexOf('<img src="http')) !== -1) {
            value = value.slice(0, imgUrlIdx + 10) + value.slice(value.indexOf('/', imgUrlIdx + 18));
        }

        if (value !== this.currentText) {
            this.currentText = value;

            if (this.timeout) {
                clearTimeout(this.timeout);
            }

            this.timeout = setTimeout(() => {
                const { dispatch, cardId, fieldId } = this.props;
                const textInfo: TextInfo = { value };

                dispatch(cardSetChangeText(cardId, fieldId, textInfo));
            }, timeoutInMiliseconds);
        }
    };

    handleBlur = () => {
        this.updateContent(0);
    };

    handleInput = () => {
        this.updateContent(500);
    };

    handlePaste = (event: React.ClipboardEvent) => {
        function escapeHtml(unsafe: string) {
            return unsafe
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }

        event.preventDefault();

        let text = '';
        text = event.clipboardData.getData('text/plain');

        text = text
            .split('\n')
            .map((s: string) => `<div>${escapeHtml(s)}</div>`)
            .join('');
        document.execCommand('insertHTML', false, text);
    };

    render() {
        const { color, align, fontFamily, fontVariant, fontSize, lineHeight } = this.props;
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
                className={style.content}
                contentEditable={true}
                onFocus={this.onFocus}
                onBlur={this.handleBlur}
                onInput={this.handleInput}
                onPaste={this.handlePaste}
                style={{
                    width: '100%',
                    height: '100%',
                    textAlign: align === 'left' ? 'left' : align === 'right' ? 'right' : 'center',
                    color: color,
                    fontFamily: `'${fontFamily}'` || DEFAULT_FONT,
                    fontStyle: isItalic ? 'italic' : 'normal',
                    fontWeight,
                    fontSize: `${fontSize}px`,
                    outline: 'none',
                    overflowWrap: 'break-word',
                    lineHeight,
                }}
                dangerouslySetInnerHTML={{ __html: this.props.textValue }}
            />
        );
    }
}

const mapStateToProps = (state: State, props: OwnProps): StateProps => {
    let fieldInfo = state.cardset.present.fields[props.cardId][props.fieldId];
    const textValue = fieldInfo.type === 'text' ? fieldInfo.value : '';
    return {
        textValue,
        isActive:
            props.cardId === state.cardset.present.activeCardId &&
            props.fieldId === state.cardset.present.activeFieldId,
    };
};

export default connect<StateProps, DispatchProps, OwnProps, State>(mapStateToProps)(ContentEditable);
