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
    width: number;
    height: number;
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
        const { placeholders, card, width, height } = this.props;
        const ppmm = this.state.dimensions.width / width;

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
                                width: `${width}mm`,
                                height: `${height}mm`,
                                border: '1px solid black',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                            onMouseDown={this.handleFieldDeselect}
                            onTouchStart={this.handleFieldDeselect}
                        >
                            {Object.values(placeholders).map(p => {
                                if (p.type === 'image') {
                                    return <ImageField key={p.id} cardId={card.id} imagePlaceholder={p} ppmm={ppmm} />;
                                } else if (p.type === 'text') {
                                    return <TextField key={p.id} cardId={card.id} textPlaceholder={p} ppmm={ppmm} />;
                                }
                                return null;
                            })}
                        </div>

                        <button onClick={this.handleRemoveCardClick} title="Remove card">
                            <i className="material-icons">delete</i>
                        </button>
                        <button onClick={this.handleCloneCardClick} title="Clone card">
                            <i className="material-icons">file_copy</i>
                        </button>
                        <input type="number" value={card.count.toString()} onChange={this.handleCountChange} />
                        <button onClick={this.handleAddTextClick} title="Add text field">
                            <i className="material-icons">text_fields</i>
                        </button>
                        <button onClick={this.handleAddImageClick} title="Add image field">
                            <i className="material-icons">add_photo_alternate</i>
                        </button>
                        <button onClick={this.handleRemoveClick} title="Remove field">
                            <i className="material-icons">remove</i>
                        </button>
                        <button onClick={this.handleSetTextAlignLeft} title="Align text left">
                            <i className="material-icons">format_align_left</i>
                        </button>
                        <button onClick={this.handleSetTextAlignCenter} title="Align text center">
                            <i className="material-icons">format_align_center</i>
                        </button>
                        <button onClick={this.handleSetTextAlignRight} title="Align text right">
                            <i className="material-icons">format_align_right</i>
                        </button>
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
        width: state.cardsets.width,
        height: state.cardsets.height,
    };
};

export default connect(mapStateToProps)(Card);
