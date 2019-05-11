import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import React, { Component } from 'react';

import {
    CardSetsCollection,
    Dispatch,
    GameType,
    IdsArray,
    cardSetCreateRequest,
    cardSetDeleteRequest,
    gameRenameRequest,
    messageDisplay,
} from '../actions';
import { State } from '../reducers';
import ConfirmedDelete from './ConfirmedDelete';
import EditableTitle from './EditableTitle';
import KawaiiMessage, { Character } from './KawaiiMessage';
import PDFGenerator from './PDFGenerator';

interface Props {
    dispatch: Dispatch;
    isAuthenticated: boolean;
    activeGame: GameType | null;
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

    handleGameNameChange = (newName: string) => {
        const { dispatch, activeGame } = this.props;
        if (activeGame !== null) {
            dispatch(gameRenameRequest(activeGame.id, newName));
        }
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
            dispatch(cardSetCreateRequest(cardSetName, this.state.width, this.state.height, activeGame.id));
        } else {
            dispatch(messageDisplay('error', 'Card Set name should be non empty.'));
        }
    };

    handleCardSetDelete = (cardSetId: string) => {
        const { dispatch } = this.props;
        dispatch(cardSetDeleteRequest(cardSetId));
    };

    render() {
        const { isAuthenticated, activeGame, allIds, byId } = this.props;

        const cardsetItems = allIds
            .map(gameId => byId[gameId])
            .map(cardset => (
                <li key={cardset.id}>
                    <Link to={`/cardset/${cardset.id}`}>{cardset.name}</Link>{' '}
                    <ConfirmedDelete
                        question="Do you really want to delete this card set?"
                        onDelete={() => this.handleCardSetDelete(cardset.id)}
                    />
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

                    <EditableTitle title={activeGame.name} onChange={this.handleGameNameChange} />

                    <ul>{cardsetItems}</ul>

                    <div className="form">
                        <label htmlFor="cardset_name">Card Set name:</label>
                        <input
                            id="cardset_name"
                            type="text"
                            onChange={this.handleChange}
                            className="form-control"
                            placeholder="Card Set name"
                        />
                        <label htmlFor="card_width">Card width:</label>
                        <input
                            id="card_width"
                            type="number"
                            min="0"
                            step="0.1"
                            onChange={this.handleWidthChange}
                            className="form-control"
                            placeholder="Card width"
                            value={this.state.width}
                        />
                        <label htmlFor="card_height">Card height:</label>
                        <input
                            id="card_height"
                            type="number"
                            min="0"
                            step="0.1"
                            onChange={this.handleHeightChange}
                            className="form-control"
                            placeholder="Card height"
                            value={this.state.height}
                        />
                        <button onClick={this.handleCreateCardSetClick}>Create Card Set</button>
                    </div>

                    <KawaiiMessage character={Character.Ghost} mood="excited">
                        Hint: Poker card size 63.5mm x 88.9mm. Bridge card size 57.15mm x 88.9mm. But you can cards of
                        any size.
                    </KawaiiMessage>

                    <PDFGenerator type="games" id={activeGame.id} />
                </div>
            )
        );
    }
}

const mapStateToProps = (state: State) => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        activeGame:
            state.games.active && state.games.byId[state.games.active] ? state.games.byId[state.games.active] : null,
        allIds: state.cardsets.allIds,
        byId: state.cardsets.byId,
    };
};

export default connect(mapStateToProps)(CardSets);
