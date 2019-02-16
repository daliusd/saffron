import { connect } from 'react-redux';
import Measure from 'react-measure';
import React, { Component } from 'react';

import {
    CardType,
    Dispatch,
    PlaceholderType,
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
import ImageSelectionDialog from './ImageSelectionDialog';
import TextField from './TextField';
import style from './Card.module.css';

interface OwnProps {
    card: CardType;
}

interface StateProps {
    placeholders: PlaceholdersCollection;
    width: number;
    height: number;
    activePlaceholder: PlaceholderType | null;
    imageUrl: string;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & StateProps & DispatchProps;

interface LocalState {
    dimensions: {
        width: number;
        height: number;
    };
    imageSelectionDialogIsOpen: boolean;
}

class Card extends Component<Props, LocalState> {
    state = {
        dimensions: {
            width: -1,
            height: -1,
        },
        imageSelectionDialogIsOpen: false,
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

    handleChangeImage = () => {
        this.setState({ imageSelectionDialogIsOpen: true });
    };

    handleImageSelectionDialogClose = () => {
        this.setState({ imageSelectionDialogIsOpen: false });
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
        const { placeholders, card, width, height, imageUrl, activePlaceholder } = this.props;
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
                    <div className={style.card}>
                        <div
                            className={style.cardWorkarea}
                            id={`card_${card.id}`}
                            ref={measureRef}
                            style={{
                                width: `${width}mm`,
                                height: `${height}mm`,
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

                        <div>
                            <button onClick={this.handleAddImageClick} title="Add image field">
                                <i className="material-icons">add_photo_alternate</i>
                            </button>
                            <button onClick={this.handleAddTextClick} title="Add text field">
                                <i className="material-icons">text_fields</i>
                            </button>

                            <button onClick={this.handleCloneCardClick} title="Clone card">
                                <i className="material-icons">file_copy</i>
                            </button>
                            <input
                                type="number"
                                value={card.count.toString()}
                                onChange={this.handleCountChange}
                                title="Number of card's copies"
                            />
                            <button onClick={this.handleRemoveCardClick} title="Remove card">
                                <i className="material-icons">delete</i>
                            </button>
                        </div>

                        <div>
                            {activePlaceholder !== null && activePlaceholder.type === 'image' && (
                                <>
                                    <button onClick={this.handleChangeImage} title="Change image">
                                        <i className="material-icons">photo</i>
                                    </button>
                                    <ImageSelectionDialog
                                        imageUrl={imageUrl}
                                        cardId={card.id}
                                        placeholder={activePlaceholder}
                                        onClose={this.handleImageSelectionDialogClose}
                                        isOpen={this.state.imageSelectionDialogIsOpen}
                                    />
                                </>
                            )}

                            {activePlaceholder !== null && activePlaceholder.type === 'text' && (
                                <>
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
                                </>
                            )}

                            {activePlaceholder !== null && (
                                <button onClick={this.handleRemoveClick} title="Remove field">
                                    <i className="material-icons">remove</i>
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </Measure>
        );
    }
}

const mapStateToProps = (state: State, props: OwnProps): StateProps => {
    const activePlaceholder =
        state.cardsets.activePlaceholder !== null
            ? state.cardsets.placeholders[state.cardsets.activePlaceholder]
            : null;

    const imageUrl =
        state.cardsets.images &&
        state.cardsets.images[props.card.id] &&
        activePlaceholder !== null &&
        activePlaceholder.type === 'image' &&
        state.cardsets.images[props.card.id][activePlaceholder.id]
            ? state.cardsets.images[props.card.id][activePlaceholder.id].url
            : '';
    return {
        placeholders: state.cardsets.placeholders,
        width: state.cardsets.width,
        height: state.cardsets.height,
        activePlaceholder,
        imageUrl,
    };
};

export default connect<StateProps, DispatchProps, OwnProps, State>(mapStateToProps)(Card);
