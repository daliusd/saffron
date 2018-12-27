// @flow
import { connect } from 'react-redux';
import Measure from 'react-measure';
import React, { Component } from 'react';

import {
    type CardType,
    type Dispatch,
    type PlaceholdersCollection,
    cardSetActiveCardAndPlaceholder,
    cardSetAddTextPlaceholder,
    cardSetChangeActiveTextPlaceholderAlign,
    cardSetCloneCard,
    cardSetRemoveCard,
    cardSetUpdateCardCount,
} from '../actions';
import ColorButton from './ColorButton';
import FontSelector from './FontSelector';
import TextField from './TextField';

type Props = {
    card: CardType,
    dispatch: Dispatch,
    placeholders: PlaceholdersCollection,
};

type State = {
    dimensions: {
        width: number,
        height: number,
    },
};

class Card extends Component<Props, State> {
    state = {
        dimensions: {
            width: -1,
            height: -1,
        },
    };

    handleRemoveCardClick = (event: SyntheticEvent<>) => {
        const { card, dispatch } = this.props;
        dispatch(cardSetRemoveCard(card));
    };

    handleCloneCardClick = (event: SyntheticEvent<>) => {
        const { card, dispatch } = this.props;
        dispatch(cardSetCloneCard(card));
    };

    handleCountChange = (event: SyntheticInputEvent<>) => {
        const { card, dispatch } = this.props;
        dispatch(cardSetUpdateCardCount(card, parseInt(event.target.value)));
    };

    handleAddTextClick = () => {
        const { dispatch } = this.props;
        dispatch(cardSetAddTextPlaceholder());
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

    handleFieldDeselect = () => {
        const { dispatch } = this.props;
        dispatch(cardSetActiveCardAndPlaceholder(null, null));
    };

    render() {
        const { placeholders, card } = this.props;
        const { width } = this.state.dimensions;
        const placeholderIds: Array<string> = placeholders ? Object.keys(placeholders) : [];

        return (
            <Measure
                client
                onResize={contentRect => {
                    this.setState({ dimensions: contentRect.client });
                }}
            >
                {({ measureRef }) => (
                    <div>
                        <div
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
                                placeholderIds.map(p => (
                                    <TextField key={p} cardId={card.id} textPlaceholder={placeholders[p]} />
                                ))}
                        </div>

                        <button onClick={this.handleRemoveCardClick}>Remove</button>
                        <button onClick={this.handleCloneCardClick}>Clone</button>
                        <input type="number" value={card.count.toString()} onChange={this.handleCountChange} />
                        <button onClick={this.handleAddTextClick}>Text</button>
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

const mapStateToProps = state => {
    return {
        placeholders: state.cardsets.placeholders,
    };
};

export default connect(mapStateToProps)(Card);
