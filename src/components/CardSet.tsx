import { connect } from 'react-redux';
import React, { Component } from 'react';
import shortid from 'shortid';

import { ACTIVITY_CREATING_PDF, State } from '../reducers';
import {
    CardType,
    CardsCollection,
    Dispatch,
    cardSetChangeHeight,
    cardSetChangeWidth,
    cardSetCreateCard,
    gameCreatePdfRequest,
} from '../actions';
import Card from './Card';

interface StateProps {
    width: number;
    height: number;
    isAuthenticated: boolean;
    cardsAllIds: string[];
    cardsById: CardsCollection;
    isCreatingPdf: boolean;
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
        topBottomMargin: 20,
        leftRightMargin: 20,
    };

    handleCreateCardClick = () => {
        const { dispatch } = this.props;

        const newCard: CardType = { id: shortid.generate(), count: 1 };

        dispatch(cardSetCreateCard(newCard));
    };

    handleGeneratePdfClick = () => {
        const { dispatch } = this.props;
        const { pageWidth, pageHeight, topBottomMargin, leftRightMargin } = this.state;

        dispatch(gameCreatePdfRequest(pageWidth, pageHeight, topBottomMargin, leftRightMargin));
    };

    handleWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { dispatch } = this.props;
        dispatch(cardSetChangeWidth(parseFloat(event.target.value)));
    };

    handleHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { dispatch } = this.props;
        dispatch(cardSetChangeHeight(parseFloat(event.target.value)));
    };

    handlePageWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ pageWidth: parseFloat(event.target.value) });
    };

    handlePageHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ pageHeight: parseFloat(event.target.value) });
    };

    handleTopBottomMarginChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ topBottomMargin: parseFloat(event.target.value) });
    };

    handleLeftRightMarginChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ leftRightMargin: parseFloat(event.target.value) });
    };

    render() {
        const { isAuthenticated, cardsAllIds, cardsById, width, height, isCreatingPdf } = this.props;

        return (
            isAuthenticated && (
                <div>
                    <div>
                        <input
                            type="number"
                            min="0"
                            step="0.1"
                            onChange={this.handleWidthChange}
                            className="form-control"
                            placeholder="width"
                            value={width}
                        />
                        <input
                            type="number"
                            min="0"
                            step="0.1"
                            onChange={this.handleHeightChange}
                            className="form-control"
                            placeholder="height"
                            value={height}
                        />
                    </div>
                    <div>
                        <ul>
                            {cardsAllIds &&
                                cardsAllIds.map(cardId => (
                                    <li key={cardId}>
                                        <Card card={cardsById[cardId]} />
                                    </li>
                                ))}
                        </ul>
                    </div>
                    <div>
                        <button onClick={this.handleCreateCardClick}>Create Card</button>
                    </div>

                    <div>
                        <input
                            type="number"
                            onChange={this.handlePageWidthChange}
                            placeholder="Page width"
                            value={this.state.pageWidth}
                        />
                        <input
                            type="number"
                            onChange={this.handlePageHeightChange}
                            placeholder="Page Height"
                            value={this.state.pageHeight}
                        />
                        <input
                            type="number"
                            onChange={this.handleTopBottomMarginChange}
                            placeholder="Top/Bottom margin"
                            value={this.state.topBottomMargin}
                        />
                        <input
                            type="number"
                            onChange={this.handleLeftRightMarginChange}
                            placeholder="Left/Right margin"
                            value={this.state.leftRightMargin}
                        />
                    </div>

                    <div>
                        <button disabled={isCreatingPdf} onClick={this.handleGeneratePdfClick}>
                            Generate PDF
                        </button>
                    </div>
                </div>
            )
        );
    }
}

const mapStateToProps = (state: State): StateProps => {
    return {
        width: state.cardsets.width,
        height: state.cardsets.height,
        isAuthenticated: state.auth.isAuthenticated,
        cardsAllIds: state.cardsets.cardsAllIds,
        cardsById: state.cardsets.cardsById,
        isCreatingPdf: (state.games.activity & ACTIVITY_CREATING_PDF) === ACTIVITY_CREATING_PDF,
    };
};

export default connect<StateProps, DispatchProps, {}, State>(mapStateToProps)(CardSet);
