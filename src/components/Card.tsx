import { connect } from 'react-redux';
import Measure from 'react-measure';
import React, { Component } from 'react';

import {
    CardType,
    Dispatch,
    PlaceholdersCollection,
    cardSetActiveCardAndPlaceholder,
    cardSetAddImagePlaceholder,
    cardSetAddTextPlaceholder,
    cardSetChangeActiveTextPlaceholderAlign,
    cardSetCloneCard,
    cardSetRemoveActivePlaceholder,
    cardSetRemoveCard,
    cardSetUpdateCardCount,
} from '../actions';
import { State } from '../reducers';
import ColorButton from './ColorButton';
import FontSelector from './FontSelector';
import ImageField from './ImageField';
import TextField from './TextField';

interface Props {
    card: CardType;
    dispatch: Dispatch;
    placeholders: PlaceholdersCollection;
}

interface LocalState {
    dimensions: {
        width: number;
        height: number;
    };
}

class Card extends Component<Props, LocalState> {
    state = {
        dimensions: {
            width: -1,
            height: -1,
        },
    };

    handleRemoveCardClick = () => {
        const { card, dispatch } = this.props;
        dispatch(cardSetRemoveCard(card));
    };

    handleCloneCardClick = () => {
        const { card, dispatch } = this.props;
        dispatch(cardSetCloneCard(card));
    };

    handleCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { card, dispatch } = this.props;
        dispatch(cardSetUpdateCardCount(card, parseInt(event.target.value)));
    };

    handleAddTextClick = () => {
        const { dispatch } = this.props;
        dispatch(cardSetAddTextPlaceholder());
    };

    handleAddImageClick = () => {
        const { dispatch } = this.props;
        dispatch(cardSetAddImagePlaceholder());
    };

    handleRemoveClick = () => {
        const { dispatch } = this.props;
        dispatch(cardSetRemoveActivePlaceholder());
    };

    handleSetTextAlignLeft = () => {
        const { dispatch } = this.props;
        dispatch(cardSetChangeActiveTextPlaceholderAlign('left'));
    };

    handleSetTextAlignCenter = () => {
        const { dispatch } = this.props;
        dispatch(cardSetChangeActiveTextPlaceholderAlign('center'));
    };

    handleSetTextAlignRight = () => {
        const { dispatch } = this.props;
        dispatch(cardSetChangeActiveTextPlaceholderAlign('right'));
    };

    handleFieldDeselect = (event: React.MouseEvent | React.TouchEvent) => {
        const { dispatch, card } = this.props;
        const el = event.target as HTMLElement;
        if (el.getAttribute('id') === `card_${card.id}`) {
            dispatch(cardSetActiveCardAndPlaceholder(null, null));
        }
    };

    render() {
        const { placeholders, card } = this.props;
        const { width } = this.state.dimensions;
        const placeholderIds: string[] = placeholders ? Object.keys(placeholders) : [];

        return (
            <Measure
                client
                onResize={contentRect => {
                    if (!contentRect.client) {
                        return;
                    }
                    this.setState({ dimensions: contentRect.client });
                }}
            >
                {({ measureRef }) => (
                    <div>
                        <div
                            id={`card_${card.id}`}
                            ref={measureRef}
                            style={{
                                width: '5cm',
                                height: `${width * 1.5}px`,
                                border: '1px solid black',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                            onMouseDown={this.handleFieldDeselect}
                            onTouchStart={this.handleFieldDeselect}
                        >
                            {placeholderIds &&
                                placeholderIds.map(p => {
                                    const placeholder = placeholders[p];
                                    if (placeholder.type === 'image') {
                                        return <ImageField key={p} cardId={card.id} imagePlaceholder={placeholder} />;
                                    }
                                    return null;
                                })}

                            {placeholderIds &&
                                placeholderIds.map(p => {
                                    const placeholder = placeholders[p];
                                    if (placeholder.type === 'text') {
                                        return <TextField key={p} cardId={card.id} textPlaceholder={placeholder} />;
                                    }
                                    return null;
                                })}
                        </div>

                        <button onClick={this.handleRemoveCardClick}>Remove</button>
                        <button onClick={this.handleCloneCardClick}>Clone</button>
                        <input type="number" value={card.count.toString()} onChange={this.handleCountChange} />
                        <button onClick={this.handleAddTextClick}>+Text</button>
                        <button onClick={this.handleAddImageClick}>+Image</button>
                        <button onClick={this.handleRemoveClick}>-</button>
                        <button onClick={this.handleSetTextAlignLeft}>L</button>
                        <button onClick={this.handleSetTextAlignCenter}>C</button>
                        <button onClick={this.handleSetTextAlignRight}>R</button>
                        <ColorButton />
                        <FontSelector />
                    </div>
                )}
            </Measure>
        );
    }
}

const mapStateToProps = (state: State) => {
    return {
        placeholders: state.cardsets.placeholders,
    };
};

export default connect(mapStateToProps)(Card);
