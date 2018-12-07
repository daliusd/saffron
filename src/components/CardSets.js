// @flow
import { connect } from 'react-redux';
import React, { Component } from 'react';

import { type CardSetType, type Dispatch, cardSetCreateRequest, cardSetSelectRequest } from '../actions';

type Props = {
    dispatch: Dispatch,
    isAuthenticated: boolean,
    cardsetlist: Array<CardSetType>,
    activeGame: number,
};

export class CardSets extends Component<Props> {
    handleCreateCardSetClick(event: SyntheticEvent<>) {
        const { dispatch, activeGame } = this.props;

        const cardsetname = this.refs.cardsetname;

        dispatch(cardSetCreateRequest(cardsetname.value.trim(), activeGame));
    }

    handleCardSetSelect(event: SyntheticEvent<>, cardset_id: number) {
        const { dispatch } = this.props;

        dispatch(cardSetSelectRequest(cardset_id));
    }

    render() {
        const { isAuthenticated, cardsetlist, activeGame } = this.props;

        const cardsetItems = cardsetlist.map(cardset => (
            <li key={cardset.id.toString()} onClick={event => this.handleCardSetSelect(event, cardset.id)}>
                {cardset.name}
            </li>
        ));

        return (
            isAuthenticated &&
            activeGame !== null && (
                <div>
                    <div>
                        <input type="text" ref="cardsetname" className="form-control" placeholder="Card Set name" />
                        <button onClick={event => this.handleCreateCardSetClick(event)}>Create Card Set</button>
                    </div>
                    <ul>{cardsetItems}</ul>
                </div>
            )
        );
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        cardsetlist: state.cardsets.cardsetlist,
        activeGame: state.games.active,
    };
};

export default connect(mapStateToProps)(CardSets);
