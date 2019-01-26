import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import React, { Component } from 'react';

import { CardSetsCollection, Dispatch, IdsArray, cardSetCreateRequest, messageRequest } from '../actions';
import { State } from '../reducers';

interface Props {
    dispatch: Dispatch;
    isAuthenticated: boolean;
    activeGame: string | null;
    allIds: IdsArray;
    byId: CardSetsCollection;
}

interface LocalState {
    cardSetName: string;
}

export class CardSets extends Component<Props, LocalState> {
    state: LocalState = {
        cardSetName: '',
    };

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ cardSetName: event.target.value });
    };

    handleCreateCardSetClick = () => {
        const { dispatch, activeGame } = this.props;

        if (activeGame === null) {
            return;
        }

        const cardSetName = this.state.cardSetName.trim();

        if (cardSetName) {
            dispatch(cardSetCreateRequest(cardSetName, activeGame));
        } else {
            dispatch(messageRequest('error', 'Card Set name should be non empty.'));
        }
    };

    render() {
        const { isAuthenticated, activeGame, allIds, byId } = this.props;

        const cardsetItems = allIds
            .map(gameId => byId[gameId])
            .map(cardset => (
                <li key={cardset.id}>
                    <Link to={`/cardset/${cardset.id}`}>{cardset.name}</Link>
                </li>
            ));

        return (
            isAuthenticated &&
            activeGame !== null && (
                <div>
                    <ul>{cardsetItems}</ul>
                    <div>
                        <input
                            type="text"
                            onChange={this.handleChange}
                            className="form-control"
                            placeholder="Card Set name"
                        />
                        <button onClick={this.handleCreateCardSetClick}>Create Card Set</button>
                    </div>
                </div>
            )
        );
    }
}

const mapStateToProps = (state: State) => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        activeGame: state.games.active,
        allIds: state.cardsets.allIds,
        byId: state.cardsets.byId,
    };
};

export default connect(mapStateToProps)(CardSets);
