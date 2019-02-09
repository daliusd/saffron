import { connect } from 'react-redux';
import React, { Component } from 'react';
import shortid from 'shortid';

import {
    CardType,
    Dispatch,
    PlaceholdersCollection,
    PlaceholdersImageInfoByCardCollection,
    PlaceholdersTextInfoByCardCollection,
    cardSetChangeHeight,
    cardSetChangeWidth,
    cardSetCreateCard,
} from '../actions';
import { State } from '../reducers';
import Card from './Card';

interface StateProps {
    width: number;
    height: number;
    isAuthenticated: boolean;
    cardsAllIds: string[];
    cardsById: { [propName: string]: CardType };
    placeholders: PlaceholdersCollection;
    texts: PlaceholdersTextInfoByCardCollection;
    images: PlaceholdersImageInfoByCardCollection;
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
    worker: Worker | null = null;

    state = {
        pageWidth: 210,
        pageHeight: 297,
        topBottomMargin: 20,
        leftRightMargin: 20,
    };

    componentDidMount = () => {
        // @ts-ignore
        if (!window.Worker) return;

        this.worker = new Worker('/js/worker.js');
        this.worker.addEventListener('message', event => {
            const blobURL = event.data;

            const tempLink = document.createElement('a');
            tempLink.style.display = 'none';
            tempLink.href = blobURL;
            tempLink.setAttribute('download', 'card.pdf');
            if (typeof tempLink.download === 'undefined') {
                tempLink.setAttribute('target', '_blank');
            }
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
            setTimeout(() => {
                window.URL.revokeObjectURL(blobURL);
            }, 100);
        });
    };

    handleCreateCardClick = () => {
        const { dispatch } = this.props;

        const newCard: CardType = { id: shortid.generate(), count: 1 };

        dispatch(cardSetCreateCard(newCard));
    };

    handleGeneratePdfClick = () => {
        if (this.worker) {
            this.worker.postMessage(JSON.parse(JSON.stringify(this.props)));
        }
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
        const { isAuthenticated, cardsAllIds, cardsById, width, height } = this.props;

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
                        <button onClick={this.handleGeneratePdfClick}>Generate PDF</button>
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
        placeholders: state.cardsets.placeholders,
        texts: state.cardsets.texts,
        images: state.cardsets.images,
    };
};

export default connect<StateProps, DispatchProps, {}, State>(mapStateToProps)(CardSet);
