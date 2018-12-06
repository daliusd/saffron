// @flow
import React, { Component } from 'react';

import type { CardSetType } from '../actions';

type Props = {
    onCardSetCreate: (cardsetname: string) => void,
    isAuthenticated: boolean,
    cardsetlist: Array<CardSetType>,
    activeGame: ?number,
};

export default class CardSets extends Component<Props> {
    handleCreateCardSetClick(event: SyntheticEvent<>) {
        const cardsetname = this.refs.cardsetname;
        this.props.onCardSetCreate(cardsetname.value.trim());
    }

    render() {
        const { isAuthenticated, cardsetlist, activeGame } = this.props;

        const cardsetItems = cardsetlist.map(cardset => <li key={cardset.id.toString()}>{cardset.name}</li>);

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
