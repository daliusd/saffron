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

    handleGeneratePdfClick = () => {};

    render() {
        const { isAuthenticated, cardsAllIds, cardsById } = this.props;

        return (
            isAuthenticated && (
                <div>
                    <div>
                        <ul>
                            {cardsAllIds &&
                                cardsAllIds.map(cardId => (
                                    <li key={cardId}>
                                        <Card card={cardsById[cardId]} />
                                    </li>
                                ))}
                        </ul>
                    </div>
                    <div>
                        <button onClick={this.handleCreateCardClick}>Create Card</button>
                    </div>
                    <div>
                        <button onClick={this.handleGeneratePdfClick}>Generate PDF</button>
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
