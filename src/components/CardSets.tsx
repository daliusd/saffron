import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import React, { Component } from 'react';

import { CardSetsCollection, Dispatch, IdsArray, cardSetCreateRequest, messageRequest } from '../actions';
import { State } from '../reducers';
import KawaiiMessage, { Character } from './KawaiiMessage';

interface Props {
    dispatch: Dispatch;
    isAuthenticated: boolean;
    activeGame: string | null;
    allIds: IdsArray;
    byId: CardSetsCollection;
}

interface LocalState {
    cardSetName: string;
    width: number;
    height: number;
}

export class CardSets extends Component<Props, LocalState> {
    state: LocalState = {
        cardSetName: '',
        width: 63.5,
        height: 88.9,
    };

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ cardSetName: event.target.value });
    };

    handleWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ width: parseFloat(event.target.value) });
    };

    handleHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ height: parseFloat(event.target.value) });
    };

    handleCreateCardSetClick = () => {
        const { dispatch, activeGame } = this.props;

        if (activeGame === null) {
            return;
        }

        const cardSetName = this.state.cardSetName.trim();

        if (cardSetName) {
            dispatch(cardSetCreateRequest(cardSetName, this.state.width, this.state.height, activeGame));
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
                    <KawaiiMessage character={Character.Ghost}>
                        Each game is made from card sets. Card set is collection of cards that share the same properties
                        but have different text and images.
                    </KawaiiMessage>

                    <ul>{cardsetItems}</ul>

                    <div className="form">
                        <input
                            type="text"
                            onChange={this.handleChange}
                            className="form-control"
                            placeholder="Card Set name"
                        />
                        <input
                            type="number"
                            min="0"
                            step="0.1"
                            onChange={this.handleWidthChange}
                            className="form-control"
                            placeholder="width"
                            value={this.state.width}
                        />
                        <input
                            type="number"
                            min="0"
                            step="0.1"
                            onChange={this.handleHeightChange}
                            className="form-control"
                            placeholder="height"
                            value={this.state.height}
                        />
                        <button onClick={this.handleCreateCardSetClick}>Create Card Set</button>
                    </div>

                    <KawaiiMessage character={Character.Ghost} mood="excited">
                        Hint: Poker card size 63.5mm x 88.9mm. Bridge card size 56mm x 88.9mm. But you can cards of any
                        size.
                    </KawaiiMessage>
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
