// @flow
import { connect } from 'react-redux';
import React, { Component } from 'react';
import shortid from 'shortid';

import { type CardType, type Dispatch, cardSetCreateCard } from '../actions';
import Card from './Card';

type Props = {
    dispatch: Dispatch,
    isAuthenticated: boolean,
    cardsAllIds: Array<string>,
    cardsById: { [string]: CardType },
};

export class CardSet extends Component<Props> {
    handleCreateCardClick(event: SyntheticEvent<>) {
        const { dispatch } = this.props;

        const newCard: CardType = { id: shortid.generate(), count: 1 };

        dispatch(cardSetCreateCard(newCard));
    }

    render() {
        const { isAuthenticated, cardsAllIds, cardsById } = this.props;

        return (
            isAuthenticated && (
                <div>
                    <div>
                        <ul>
                            {cardsAllIds &&
                                cardsAllIds.map(card_id => (
                                    <li key={card_id}>
                                        <Card card={cardsById[card_id]} />
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
        cardsAllIds: state.cardsets.cardsAllIds,
        cardsById: state.cardsets.cardsById,
    };
};

export default connect(mapStateToProps)(CardSet);
