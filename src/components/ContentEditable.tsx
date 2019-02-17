import { connect } from 'react-redux';
import React, { Component } from 'react';

import { DEFAULT_FONT, DEFAULT_FONT_SIZE } from '../fontLoader';
import { Dispatch, TextInfo, cardSetActiveCardAndPlaceholder, cardSetChangeText } from '../actions';
import { State } from '../reducers';

interface OwnProps {
    cardId: string;
    placeholderId: string;
    align: string;
    color: string;
    fontFamily: string;
    fontVariant: string;
    fontSize: number;
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
    timeout: NodeJS.Timeout | null;
    wasMoved: boolean;

    constructor(props: Props) {
        super(props);
        this.editDiv = React.createRef();
        this.currentText = '';
        this.currentAlign = '';
        this.currentColor = '';
        this.currentFontFamily = '';
        this.currentFontVariant = '';
        this.currentFontSize = DEFAULT_FONT_SIZE;
        this.timeout = null;
        this.wasMoved = false;
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
        return (
            nextProps.textValue !== this.currentText ||
            nextProps.align !== this.currentAlign ||
            nextProps.color !== this.currentColor ||
            nextProps.fontFamily !== this.currentFontFamily ||
            nextProps.fontVariant !== this.currentFontVariant ||
            nextProps.fontSize !== this.currentFontSize ||
            this.props.isActive !== nextProps.isActive
        );
    }

    componentDidUpdate() {
        const { textValue, align, color, fontFamily, fontVariant, fontSize } = this.props;
        this.currentText = textValue;
        this.currentAlign = align;
        this.currentColor = color;
        this.currentFontFamily = fontFamily;
        this.currentFontVariant = fontVariant;
        this.currentFontSize = fontSize;
    }

    handleMouseDown = (event: MouseEvent) => {
        this.handleStart(event);
    };

    handleTouchStart = (event: TouchEvent) => {
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
        this.handleMove(event);
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
        this.handleComplete(event);
    };

    handleComplete = (event: Event) => {
        const { dispatch, cardId, placeholderId, isActive } = this.props;
        if (isActive) {
            event.stopPropagation();
        } else if (!this.wasMoved) {
            event.preventDefault();
            dispatch(cardSetActiveCardAndPlaceholder(cardId, placeholderId));

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
            }, timeoutInMiliseconds);
        }
    };

    handleBlur = () => {
        this.updateContent(0);
    };

    handleInput = () => {
        this.updateContent(500);
    };

    render() {
        const { color, align, fontFamily, fontVariant, fontSize } = this.props;
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
                contentEditable={true}
                onFocus={this.onFocus}
                onBlur={this.handleBlur}
                onInput={this.handleInput}
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
                }}
                dangerouslySetInnerHTML={{ __html: this.props.textValue }}
            />
        );
    }
}

const mapStateToProps = (state: State, props: OwnProps): StateProps => {
    const textInfo =
        state.cardsets.texts &&
        state.cardsets.texts[props.cardId] &&
        state.cardsets.texts[props.cardId][props.placeholderId]
            ? state.cardsets.texts[props.cardId][props.placeholderId]
            : { value: '' };
    return {
        textValue: textInfo.value.replace(/<br>/g, ''),
        isActive:
            props.cardId === state.cardsets.activeCard && props.placeholderId === state.cardsets.activePlaceholder,
    };
};

export default connect<StateProps, DispatchProps, OwnProps, State>(mapStateToProps)(ContentEditable);
