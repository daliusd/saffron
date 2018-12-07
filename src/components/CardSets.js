// @flow
import { connect } from 'react-redux';
import React, { Component } from 'react';

import {
    type CardSetsCollection,
    type Dispatch,
    type IdsArray,
    cardSetCreateRequest,
    cardSetSelectRequest,
} from '../actions';

type Props = {
    dispatch: Dispatch,
    isAuthenticated: boolean,
    activeGame: number,
    allIds: IdsArray,
    byId: CardSetsCollection,
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
        const { isAuthenticated, activeGame, allIds, byId } = this.props;

        const cardsetItems = allIds.map(game_id => byId[game_id.toString()]).map(cardset => (
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
        activeGame: state.games.active,
        allIds: state.cardsets.allIds,
        byId: state.cardsets.byId,
    };
};

export default connect(mapStateToProps)(CardSets);
