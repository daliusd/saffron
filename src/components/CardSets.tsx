import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import React, { Component } from 'react';

import { CardSetsCollection, GameType, IdsArray } from '../types';
import {
    Dispatch,
    cardSetCreateRequest,
    cardSetDeleteRequest,
    gameRenameRequest,
    messageDisplay,
    gameCreatePngRequest,
} from '../actions';
import { State, ACTIVITY_CREATING_PNG } from '../reducers';
import ConfirmedDelete from './ConfirmedDelete';
import EditableTitle from './EditableTitle';
import KawaiiMessage, { Character } from './KawaiiMessage';
import PDFGenerator from './PDFGenerator';
import style from './CardSets.module.css';

interface Props {
    dispatch: Dispatch;
    isAuthenticated: boolean;
    activeGame: GameType | null;
    allIds: IdsArray;
    byId: CardSetsCollection;
    isCreatingPng: boolean;
}

interface LocalState {
    cardSetName: string;
    width: number;
    height: number;
    dpi: number;
}

export class CardSets extends Component<Props, LocalState> {
    state: LocalState = {
        cardSetName: '',
        width: 63.5,
        height: 88.9,
        dpi: 300,
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

    handleDpiChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ dpi: parseInt(event.target.value) });
    };

    handleGenerate = () => {
        const { dispatch, activeGame } = this.props;
        const { dpi } = this.state;

        if (activeGame !== null) {
            dispatch(gameCreatePngRequest(dpi, 'games', activeGame.id));
        }
    };

    render() {
        const { isAuthenticated, activeGame, allIds, byId, isCreatingPng } = this.props;
        const { dpi } = this.state;

        let cardsets = allIds.map(cardsetId => byId[cardsetId]);
        cardsets.sort((a, b) => (a.name < b.name ? -1 : 1));

        const cardsetItems = cardsets.map(cardset => (
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
                <div className={style.cardsets}>
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
                        Hint: Poker card size 63.5mm x 88.9mm. Bridge card size 57.15mm x 88.9mm. But you can have cards
                        of any size.
                    </KawaiiMessage>

                    <PDFGenerator type="games" id={activeGame.id} withHelp={true} />

                    <div className="form">
                        Or you can generate PNG files for all the game:
                        <label htmlFor="dpi">DPI:</label>
                        <input
                            id="dpi"
                            type="number"
                            min="1"
                            step="1"
                            onChange={this.handleDpiChange}
                            className="form-control"
                            placeholder="DPI"
                            value={dpi}
                        />
                        <button disabled={isCreatingPng} onClick={this.handleGenerate}>
                            Generate PNG files
                        </button>
                    </div>
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
        isCreatingPng: (state.games.activity & ACTIVITY_CREATING_PNG) === ACTIVITY_CREATING_PNG,
    };
};

export default connect(mapStateToProps)(CardSets);
