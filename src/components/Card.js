// @flow
import { connect } from 'react-redux';
import Measure from 'react-measure';
import React, { Component } from 'react';
import shortid from 'shortid';

import {
    type CardSetType,
    type CardType,
    type Dispatch,
    type TextTemplatesCollection,
    cardSetUpdateData,
} from '../actions';
import { getActiveCardSet } from '../selectors';
import TextField from './TextField';

type Props = {
    card: CardType,
    dispatch: Dispatch,
    activeCardSet: CardSetType,
};

type State = {
    dimensions: {
        width: number,
        height: number,
    },
};

class Card extends Component<Props, State> {
    state = {
        dimensions: {
            width: -1,
            height: -1,
        },
    };

    handleRemoveCardClick = (event: SyntheticEvent<>) => {
        const { card, dispatch, activeCardSet } = this.props;

        let cardset = Object.assign({}, activeCardSet);

        cardset.data.cardsAllIds = cardset.data.cardsAllIds.filter(id => id !== card.id);
        delete cardset.data.cardsById[card.id];

        dispatch(cardSetUpdateData(cardset));
    };

    handleCloneCardClick = (event: SyntheticEvent<>) => {
        const { card, dispatch, activeCardSet } = this.props;

        let cardset = Object.assign({}, activeCardSet);

        let newCard = Object.assign({}, card, { id: shortid.generate() });
        cardset.data.cardsAllIds.splice(cardset.data.cardsAllIds.indexOf(card.id) + 1, 0, newCard.id);

        cardset.data.cardsById[newCard.id] = newCard;

        dispatch(cardSetUpdateData(cardset));
    };

    handleCountChange = (event: SyntheticInputEvent<>) => {
        const { card, dispatch, activeCardSet } = this.props;
        let cardset = Object.assign({}, activeCardSet);

        cardset.data.cardsById[card.id].count = parseInt(event.target.value);

        dispatch(cardSetUpdateData(cardset));
    };

    handleAddTextClick = () => {
        const { dispatch, activeCardSet } = this.props;
        let cardset = Object.assign({}, activeCardSet);

        const id = shortid.generate();
        cardset.data.template.texts[id] = { id, x: 10, y: 10, width: 50, height: 50 };

        dispatch(cardSetUpdateData(cardset));
    };

    render() {
        const { activeCardSet, card } = this.props;
        const { width } = this.state.dimensions;
        const text_ids: Array<string> = activeCardSet.data ? Object.keys(activeCardSet.data.template.texts) : [];
        const texts: TextTemplatesCollection = activeCardSet.data ? activeCardSet.data.template.texts : {};

        return (
            <Measure
                client
                onResize={contentRect => {
                    console.log(contentRect);
                    this.setState({ dimensions: contentRect.client });
                }}
            >
                {({ measureRef }) => (
                    <div>
                        <div
                            ref={measureRef}
                            style={{
                                width: '5cm',
                                height: `${width * 1.5}px`,
                                border: '1px solid black',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            {text_ids &&
                                text_ids.map(t => <TextField key={t} card_id={card.id} textTemplate={texts[t]} />)}
                        </div>

                        <button onClick={this.handleRemoveCardClick}>Remove</button>
                        <button onClick={this.handleCloneCardClick}>Clone</button>
                        <input type="number" value={card.count.toString()} onChange={this.handleCountChange} />
                        <button onClick={this.handleAddTextClick}>Text</button>
                    </div>
                )}
            </Measure>
        );
    }
}

const mapStateToProps = state => {
    return {
        activeCardSet: getActiveCardSet(state),
    };
};

export default connect(mapStateToProps)(Card);
