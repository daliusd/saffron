// @flow
import { connect } from 'react-redux';
import React, { type ElementRef, PureComponent } from 'react';

import { type CardSetType, type CardType, type Dispatch, type TextTemplateType, cardSetUpdateData } from '../actions';
import { getActiveCardSet } from '../selectors';
import ContentEditable from './ContentEditable';
import FieldController from './FieldController';

type Props = {
    card: CardType,
    textTemplate: TextTemplateType,
    activeCardSet: CardSetType,
    dispatch: Dispatch,
};

class TextField extends PureComponent<Props> {
    contentEditable: ElementRef<any>;
    cursorPos: number;
    currentText: string;

    constructor() {
        super();
        this.contentEditable = React.createRef();
        this.cursorPos = 0;
        this.currentText = '';
    }

    setCursorPosAndCurrentText = editDiv => {
        const { card, textTemplate } = this.props;

        this.cursorPos = 0;
        this.currentText = '';

        if (textTemplate.id in card.texts) {
            this.currentText = card.texts[textTemplate.id].value;
            this.cursorPos = card.texts[textTemplate.id].cursor;

            if (this.cursorPos) {
                const range = document.createRange();
                range.setStart(editDiv.current.childNodes[0], this.cursorPos);
                range.setEnd(editDiv.current.childNodes[0], this.cursorPos);

                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    };

    handleSelect = () => {
        this.contentEditable.current.makeEditable();
    };

    handleKeyUp = () => {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        this.cursorPos = range.startOffset;
    };

    handleContent = value => {
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
        console.log('TextField render');
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
                <ContentEditable
                    key={textTemplate.id}
                    ref={this.contentEditable}
                    contentId={textTemplate.id}
                    onFocus={this.setCursorPosAndCurrentText}
                    onBlur={this.handleContent}
                    onKeyUp={this.handleKeyUp}
                    onChange={this.handleContent}
                    content={textTemplate.id in card.texts ? card.texts[textTemplate.id].value : ''}
                />
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
