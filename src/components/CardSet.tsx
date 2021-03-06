import { connect } from 'react-redux';
import React, { Component } from 'react';
import shortid from 'shortid';

import { ACTIVITY_SELECTING, State } from '../reducers';
import { BLEED_WIDTH } from '../constants';
import { CardSetType, CardType, CardsCollection } from '../types';
import {
    Dispatch,
    cardSetActiveCardAndField,
    cardSetCreateCard,
    cardSetRenameRequest,
    cardSetUndo,
    cardSetRedo,
} from '../actions';
import Card from './Card';
import EditableTitle from './EditableTitle';
import KawaiiMessage, { Character } from './KawaiiMessage';
import Loader from './Loader';
import Sidebar from './Sidebar';
import style from './CardSet.module.css';

interface StateProps {
    width: number;
    height: number;
    isTwoSided: boolean;
    isAuthenticated?: boolean;
    cardsAllIds: string[];
    cardsById: CardsCollection;
    activity: number;
    zoom: number;
    activeCardSet: CardSetType | null;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = StateProps & DispatchProps;

interface LocalState {
    pageWidth: number;
    pageHeight: number;
    topBottomMargin: number;
    leftRightMargin: number;
}

export class CardSet extends Component<Props, LocalState> {
    state = {
        pageWidth: 210,
        pageHeight: 297,
        topBottomMargin: 15,
        leftRightMargin: 9,
    };

    componentDidMount() {
        window.addEventListener('keydown', this.keyDown);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.keyDown);
    }

    keyDown = (event: KeyboardEvent) => {
        const { dispatch } = this.props;

        switch (event.key) {
            case 'z':
            case 'Z': {
                if (event.ctrlKey && event.shiftKey) {
                    dispatch(cardSetRedo());
                } else if (event.ctrlKey) {
                    dispatch(cardSetUndo());
                }
                break;
            }
            case 'y':
            case 'Y': {
                if (event.ctrlKey) {
                    dispatch(cardSetRedo());
                }
                break;
            }
            // no default
        }
    };

    handleCreateCardClick = () => {
        const { dispatch } = this.props;

        const newCard: CardType = { id: shortid.generate(), count: 1 };

        dispatch(cardSetCreateCard(newCard));
    };

    handleClickOutsideOfCard = () => {
        const { dispatch } = this.props;
        dispatch(cardSetActiveCardAndField(undefined, false, undefined));
    };

    handleCardSetNameChange = (newName: string) => {
        const { dispatch, activeCardSet } = this.props;
        if (activeCardSet !== null) {
            dispatch(cardSetRenameRequest(activeCardSet.id, newName));
        }
    };

    render() {
        const {
            isAuthenticated,
            cardsAllIds,
            cardsById,
            width,
            height,
            isTwoSided,
            activity,
            zoom,
            activeCardSet,
        } = this.props;

        const widthWithBleeds = width + BLEED_WIDTH * 2;
        const heightWithBleeds = height + BLEED_WIDTH * 2;

        return (
            isAuthenticated && (
                <div>
                    <KawaiiMessage character={Character.Ghost}>
                        <p>Here you can design your cards.</p>
                    </KawaiiMessage>

                    {activeCardSet !== null && (
                        <EditableTitle title={activeCardSet.name} onChange={this.handleCardSetNameChange} />
                    )}

                    <div className={style.cardsetview}>
                        <div className={style.sidebar}>
                            <Sidebar />
                        </div>
                        <div onMouseDown={this.handleClickOutsideOfCard} onTouchStart={this.handleClickOutsideOfCard}>
                            {(activity & ACTIVITY_SELECTING) === ACTIVITY_SELECTING && <Loader />}
                            <div className={style.cardset}>
                                <ul
                                    style={{
                                        gridTemplateColumns: `repeat(auto-fill, minmax(${widthWithBleeds *
                                            zoom}mm, 1fr))`,
                                    }}
                                >
                                    {cardsAllIds &&
                                        cardsAllIds.map(cardId => [
                                            <li key={cardId}>
                                                <Card card={cardsById[cardId]} isBack={false} />
                                            </li>,
                                            isTwoSided && (
                                                <li key={`${cardId}back`}>
                                                    <Card card={cardsById[cardId]} isBack={true} />
                                                </li>
                                            ),
                                        ])}
                                    <li key="newCard">
                                        <div
                                            id="newCard"
                                            className={style.createCard}
                                            style={{
                                                width: `${widthWithBleeds * zoom}mm`,
                                                height: `${heightWithBleeds * zoom}mm`,
                                                position: 'relative',
                                                overflow: 'hidden',
                                            }}
                                            onClick={this.handleCreateCardClick}
                                        >
                                            <div>
                                                <i className="material-icons">add</i>
                                                <div>Add Card</div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )
        );
    }
}

const mapStateToProps = (state: State): StateProps => {
    return {
        activity: state.cardset.present.activity,
        width: state.cardset.present.width,
        height: state.cardset.present.height,
        isTwoSided: state.cardset.present.isTwoSided,
        zoom: state.cardset.present.zoom,
        isAuthenticated: state.auth.isAuthenticated,
        cardsAllIds: state.cardset.present.cardsAllIds,
        cardsById: state.cardset.present.cardsById,
        activeCardSet:
            state.cardsets.active && state.cardsets.byId[state.cardsets.active]
                ? state.cardsets.byId[state.cardsets.active]
                : null,
    };
};

export default connect<StateProps, DispatchProps, {}, State>(mapStateToProps)(CardSet);
