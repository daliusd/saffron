// @flow
import { connect } from 'react-redux';
import Measure from 'react-measure';
import React, { Component } from 'react';
import shortid from 'shortid';

import { type CardSetType, type CardType, type Dispatch, cardSetUpdateData } from '../actions';
import { getActiveCardSet } from '../selectors';

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

        cardset.data.cards = cardset.data.cards.filter(c => c.id !== card.id);

        dispatch(cardSetUpdateData(cardset));
    };

    handleCloneCardClick = (event: SyntheticEvent<>) => {
        const { card, dispatch, activeCardSet } = this.props;

        let cardset = Object.assign({}, activeCardSet);

        cardset.data.cards.splice(
            cardset.data.cards.indexOf(card) + 1,
            0,
            Object.assign({}, card, { id: shortid.generate() }),
        );

        dispatch(cardSetUpdateData(cardset));
    };

    handleCountChange = (event: SyntheticInputEvent<>) => {
        const { card, dispatch, activeCardSet } = this.props;
        let cardset = Object.assign({}, activeCardSet);

        cardset.data.cards.filter(c => c.id === card.id)[0].count = parseInt(event.target.value);

        dispatch(cardSetUpdateData(cardset));
    };

    render() {
        const { card } = this.props;
        const { width } = this.state.dimensions;

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
                            style={{ width: '5cm', height: `${width * 1.5}px`, border: '1px solid black' }}
                        >
                            Card here
                        </div>

                        <button onClick={this.handleRemoveCardClick}>Remove</button>
                        <button onClick={this.handleCloneCardClick}>Clone</button>
                        <input type="number" value={card.count.toString()} onChange={this.handleCountChange} />
                    </div>
                )}
            </Measure>
        );
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        activeCardSet: getActiveCardSet(state),
    };
};

export default connect(mapStateToProps)(Card);
