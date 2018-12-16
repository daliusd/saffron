// @flow
import { connect } from 'react-redux';
import React, { Component } from 'react';
import shortid from 'shortid';

import { type CardSetType, type Dispatch, cardSetUpdateData } from '../actions';
import { getActiveCardSet } from '../selectors';
import Card from './Card';

type Props = {
    dispatch: Dispatch,
    isAuthenticated: boolean,
    activeCardSet: CardSetType,
};

export class CardSet extends Component<Props> {
    handleCreateCardClick(event: SyntheticEvent<>) {
        const { dispatch, activeCardSet } = this.props;

        let cardset = Object.assign({}, activeCardSet);

        if (!('data' in cardset)) {
            cardset.data = {};
        }

        if (!('template' in cardset.data)) {
            cardset.data.template = { texts: {}, images: {} };
        }
        if (!cardset.data.cardsAllIds) {
            cardset.data.cardsAllIds = [];
            cardset.data.cardsById = {};
        }
        const newCard = { id: shortid.generate(), count: 1, texts: {}, images: {} };
        cardset.data.cardsAllIds.push(newCard.id);
        cardset.data.cardsById[newCard.id] = newCard;

        dispatch(cardSetUpdateData(cardset));
    }

    render() {
        const { isAuthenticated, activeCardSet } = this.props;

        return (
            isAuthenticated &&
            activeCardSet && (
                <div>
                    <div>CardSet placeholder</div>
                    <div>
                        <ul>
                            {activeCardSet.data &&
                                activeCardSet.data.cardsAllIds &&
                                activeCardSet.data.cardsAllIds.map(card_id => (
                                    <li key={card_id}>
                                        <Card card={activeCardSet.data && activeCardSet.data.cardsById[card_id]} />
                                    </li>
                                ))}
                        </ul>
                    </div>
                    <div>
                        <button onClick={event => this.handleCreateCardClick(event)}>Create Card</button>
                    </div>
                </div>
            )
        );
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        activeCardSet: getActiveCardSet(state),
    };
};

export default connect(mapStateToProps)(CardSet);
