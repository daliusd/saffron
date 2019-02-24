import { connect } from 'react-redux';
import React, { Component } from 'react';

import {
    CardType,
    Dispatch,
    PlaceholderType,
    cardSetAddImagePlaceholder,
    cardSetRemoveActivePlaceholder,
} from '../actions';
import { State } from '../reducers';
import ImageSelectionDialog from './ImageSelectionDialog';
import style from './SidebarText.module.css';

interface StateProps {
    isAuthenticated: boolean;
    activePlaceholder: PlaceholderType | null;
    imageUrl: string;
    activeCard: CardType | null;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = StateProps & DispatchProps;

interface LocalState {
    imageSelectionDialogIsOpen: boolean;
}

export class SidebarImage extends Component<Props, LocalState> {
    state = {
        imageSelectionDialogIsOpen: false,
    };

    handleAddImageClick = () => {
        const { dispatch } = this.props;
        dispatch(cardSetAddImagePlaceholder());
    };

    handleRemoveClick = () => {
        const { activePlaceholder, dispatch } = this.props;
        if (activePlaceholder !== null) {
            dispatch(cardSetRemoveActivePlaceholder());
        }
    };

    handleChangeImage = () => {
        const { activePlaceholder } = this.props;
        if (activePlaceholder !== null && activePlaceholder.type === 'image') {
            this.setState({ imageSelectionDialogIsOpen: true });
        }
    };

    handleImageSelectionDialogClose = () => {
        this.setState({ imageSelectionDialogIsOpen: false });
    };

    render() {
        const { activeCard, activePlaceholder, imageUrl } = this.props;
        const imageSelected = activePlaceholder !== null && activePlaceholder.type === 'image';

        return (
            <div className={style.view}>
                <button onClick={this.handleAddImageClick} title="Add image field">
                    <i className="material-icons">add_photo_alternate</i>
                </button>

                <button
                    className={imageSelected ? '' : style.disabled}
                    onClick={this.handleChangeImage}
                    title="Change image"
                >
                    <i className="material-icons">photo</i>
                </button>

                {activeCard && (
                    <ImageSelectionDialog
                        imageUrl={imageUrl}
                        cardId={activeCard.id}
                        placeholderId={activePlaceholder !== null ? activePlaceholder.id : ''}
                        onClose={this.handleImageSelectionDialogClose}
                        isOpen={this.state.imageSelectionDialogIsOpen}
                    />
                )}

                <button
                    className={activePlaceholder === null ? style.disabled : ''}
                    onClick={this.handleRemoveClick}
                    title="Remove field"
                >
                    <i className="material-icons">remove</i>
                </button>
            </div>
        );
    }
}

const mapStateToProps = (state: State): StateProps => {
    const activePlaceholder =
        state.cardsets.activePlaceholder !== null
            ? state.cardsets.placeholders[state.cardsets.activePlaceholder]
            : null;

    const activeCard = state.cardsets.activeCard !== null ? state.cardsets.cardsById[state.cardsets.activeCard] : null;

    const imageUrl =
        state.cardsets.images &&
        activeCard &&
        state.cardsets.images[activeCard.id] &&
        activePlaceholder !== null &&
        activePlaceholder.type === 'image' &&
        state.cardsets.images[activeCard.id][activePlaceholder.id]
            ? state.cardsets.images[activeCard.id][activePlaceholder.id].url
            : '';

    return {
        isAuthenticated: state.auth.isAuthenticated,
        activePlaceholder,
        imageUrl,
        activeCard,
    };
};

export default connect<StateProps, DispatchProps, {}, State>(mapStateToProps)(SidebarImage);
