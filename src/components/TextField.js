// @flow
import { connect } from 'react-redux';
import React, { type ElementRef, Component } from 'react';

import { type CardSetType, type CardType, type Dispatch, type TextTemplateType, cardSetUpdateData } from '../actions';
import { getActiveCardSet } from '../selectors';
import FieldController from './FieldController';

type Props = {
    card: CardType,
    textTemplate: TextTemplateType,
    activeCardSet: CardSetType,
    dispatch: Dispatch,
};

class TextField extends Component<Props> {
    editDiv: ElementRef<any>;
    cursorPos: number;
    currentText: string;

    constructor() {
        super();
        this.editDiv = React.createRef();
        this.cursorPos = 0;
        this.currentText = '';
    }

    setCursorPosAndCurrentText = () => {
        const { card, textTemplate } = this.props;

        this.cursorPos = 0;
        this.currentText = '';

        if (textTemplate.id in card.texts) {
            this.currentText = card.texts[textTemplate.id].value;
            this.cursorPos = card.texts[textTemplate.id].cursor;

            if (this.cursorPos) {
                const range = document.createRange();
                range.setStart(this.editDiv.current.childNodes[0], this.cursorPos);
                range.setEnd(this.editDiv.current.childNodes[0], this.cursorPos);

                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    };

    handleSelect = () => {
        this.editDiv.current.contentEditable = 'true';
        this.editDiv.current.focus();
    };

    handleKeyUp = () => {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        this.cursorPos = range.startOffset;
    };

    handleContent = () => {
        const value = this.editDiv.current.innerText;

        if (value !== this.currentText) {
            this.currentText = value;

            const { dispatch, activeCardSet, card, textTemplate } = this.props;

            let cardset = { ...activeCardSet };

            let editedCard: CardType = { ...card };

            editedCard.texts[textTemplate.id] = { value, cursor: this.cursorPos };
            cardset.data.cardsById[card.id] = editedCard;

            dispatch(cardSetUpdateData(cardset));
        }
    };

    handleDrag = (x: number, y: number) => {
        const { dispatch, activeCardSet, textTemplate } = this.props;

        let cardset = Object.assign({}, activeCardSet);

        cardset.data.template.texts[textTemplate.id].x = x;
        cardset.data.template.texts[textTemplate.id].y = y;

        dispatch(cardSetUpdateData(cardset));
    };

    handleResize = (width: number, height: number) => {
        const { dispatch, activeCardSet, textTemplate } = this.props;

        let cardset = Object.assign({}, activeCardSet);

        cardset.data.template.texts[textTemplate.id].width = width;
        cardset.data.template.texts[textTemplate.id].height = height;

        dispatch(cardSetUpdateData(cardset));
    };

    handleRotate = (angle: number) => {
        const { dispatch, activeCardSet, textTemplate } = this.props;

        let cardset = { ...activeCardSet };

        cardset.data.template.texts[textTemplate.id].angle = angle;

        dispatch(cardSetUpdateData(cardset));
    };

    render() {
        const { card, textTemplate } = this.props;

        return (
            <FieldController
                x={textTemplate.x}
                y={textTemplate.y}
                width={textTemplate.width}
                height={textTemplate.height}
                angle={textTemplate.angle}
                onSelect={this.handleSelect}
                onDrag={this.handleDrag}
                onResize={this.handleResize}
                onRotate={this.handleRotate}
            >
                <div
                    ref={this.editDiv}
                    onFocus={this.setCursorPosAndCurrentText}
                    onBlur={this.handleContent}
                    onKeyUp={this.handleKeyUp}
                    style={{
                        width: '100%',
                        height: '100%',
                        overflow: 'hidden',
                    }}
                >
                    {textTemplate.id in card.texts ? card.texts[textTemplate.id].value : ''}
                </div>
            </FieldController>
        );
    }
}

const mapStateToProps = state => {
    return {
        activeCardSet: getActiveCardSet(state),
    };
};

export default connect(mapStateToProps)(TextField);
