import { connect } from 'react-redux';
import React, { Component } from 'react';
import shortid from 'shortid';

import { CardType, Dispatch, cardSetCreateCard } from '../actions';
import { State } from '../reducers';
import Card from './Card';

interface Props {
    dispatch: Dispatch;
    isAuthenticated: boolean;
    cardsAllIds: string[];
    cardsById: { [propName: string]: CardType };
}

export class CardSet extends Component<Props> {
    handleCreateCardClick = () => {
        const { dispatch } = this.props;

        const newCard: CardType = { id: shortid.generate(), count: 1 };

        dispatch(cardSetCreateCard(newCard));
    };

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
                        <button onClick={this.handleCreateCardClick}>Create Card</button>
                    </div>
                </div>
            )
        );
    }
}

const mapStateToProps = (state: State) => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        cardsAllIds: state.cardsets.cardsAllIds,
        cardsById: state.cardsets.cardsById,
    };
};

export default connect(mapStateToProps)(CardSet);
