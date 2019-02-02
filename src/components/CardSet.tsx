import { connect } from 'react-redux';
import React, { Component } from 'react';
import shortid from 'shortid';

import { CardType, Dispatch, cardSetCreateCard } from '../actions';
import { State } from '../reducers';
import Card from './Card';

interface Props {
    dispatch: Dispatch;
    isAuthenticated: boolean;
    cardsAllIds: string[];
    cardsById: { [propName: string]: CardType };
}

export class CardSet extends Component<Props> {
    worker: Worker | null = null;

    componentDidMount = () => {
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

    render() {
        const { isAuthenticated, cardsAllIds, cardsById } = this.props;

        return (
            isAuthenticated && (
                <div>
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
                        <button onClick={this.handleGeneratePdfClick}>Generate PDF</button>
                    </div>
                </div>
            )
        );
    }
}

const mapStateToProps = (state: State) => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        cardsAllIds: state.cardsets.cardsAllIds,
        cardsById: state.cardsets.cardsById,
        placeholders: state.cardsets.placeholders,
        texts: state.cardsets.texts,
        images: state.cardsets.images,
    };
};

export default connect(mapStateToProps)(CardSet);
