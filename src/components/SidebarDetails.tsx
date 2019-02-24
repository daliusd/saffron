import { connect } from 'react-redux';
import React, { Component } from 'react';

import { CardType, Dispatch, cardSetCloneCard, cardSetRemoveCard, cardSetUpdateCardCount } from '../actions';
import { State } from '../reducers';
import style from './SidebarDetails.module.css';

interface StateProps {
    isAuthenticated: boolean;
    activeCard: CardType | null;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = StateProps & DispatchProps;

export class SidebarDetails extends Component<Props> {
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

    render() {
        const { activeCard } = this.props;

        return (
            <div className={style.view}>
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
        );
    }
}

const mapStateToProps = (state: State): StateProps => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        activeCard: state.cardsets.activeCard !== null ? state.cardsets.cardsById[state.cardsets.activeCard] : null,
    };
};

export default connect<StateProps, DispatchProps, {}, State>(mapStateToProps)(SidebarDetails);
