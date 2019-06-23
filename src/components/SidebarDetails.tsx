import { connect } from 'react-redux';
import React, { Component } from 'react';

import { CardType, DispatchProps, SidebarOwnProps } from '../types';
import { State } from '../reducers';
import {
    cardSetCloneCard,
    cardSetRemoveCard,
    cardSetUpdateCardCount,
    cardSetRotateCardsRight,
    cardSetRotateCardsLeft,
    cardSetRedo,
    cardSetUndo,
} from '../actions';
import style from './SidebarDetails.module.css';

interface StateProps {
    activeCard: CardType | null;
}

type Props = StateProps & DispatchProps & SidebarOwnProps;

export class SidebarDetails extends Component<Props> {
    handleRotateRightClick = () => {
        const { dispatch } = this.props;
        dispatch(cardSetRotateCardsRight());
    };

    handleRotateLeftClick = () => {
        const { dispatch } = this.props;
        dispatch(cardSetRotateCardsLeft());
    };

    handleCloneCardClick = () => {
        const { activeCard, dispatch } = this.props;
        if (activeCard !== null) {
            dispatch(cardSetCloneCard(activeCard));
        }
    };

    handleRemoveCardClick = () => {
        const { activeCard, dispatch } = this.props;
        if (activeCard !== null) {
            dispatch(cardSetRemoveCard(activeCard));
        }
    };

    handleCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { activeCard, dispatch } = this.props;
        if (activeCard !== null) {
            dispatch(cardSetUpdateCardCount(activeCard, parseInt(event.target.value)));
        }
    };

    handleUndoClick = () => {
        const { dispatch } = this.props;
        dispatch(cardSetUndo());
    };

    handleRedoClick = () => {
        const { dispatch } = this.props;
        dispatch(cardSetRedo());
    };

    render() {
        const { activeCard, visible } = this.props;

        return (
            <div className={style.view} style={{ display: visible ? 'initial' : 'none' }}>
                <div>
                    <button
                        onClick={this.handleCloneCardClick}
                        title="Clone card"
                        className={activeCard === null ? style.disabled : ''}
                    >
                        <i className="material-icons">file_copy</i>
                    </button>

                    <input
                        type="number"
                        value={activeCard !== null ? activeCard.count.toString() : 0}
                        onChange={this.handleCountChange}
                        title="Number of card's copies"
                        className={activeCard === null ? style.disabled : ''}
                    />
                    <button
                        onClick={this.handleRemoveCardClick}
                        title="Remove card"
                        className={activeCard === null ? style.disabled : ''}
                    >
                        <i className="material-icons">delete</i>
                    </button>
                </div>

                <div>
                    <button onClick={this.handleUndoClick} title="Undo (Ctrl+Z)">
                        <i className="material-icons">undo</i>
                    </button>

                    <button onClick={this.handleRedoClick} title="Redo (Ctrl+Shift+Z or Ctrl+Y)">
                        <i className="material-icons">redo</i>
                    </button>
                </div>

                <div>
                    <button onClick={this.handleRotateRightClick} title="Rotate cards right">
                        <i className="material-icons">rotate_right</i>
                    </button>

                    <button onClick={this.handleRotateLeftClick} title="Rotate cards left">
                        <i className="material-icons">rotate_left</i>
                    </button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: State): StateProps => {
    return {
        activeCard:
            state.cardset.present.activeCardId !== undefined
                ? state.cardset.present.cardsById[state.cardset.present.activeCardId]
                : null,
    };
};

export default connect<StateProps, DispatchProps, SidebarOwnProps, State>(mapStateToProps)(SidebarDetails);
