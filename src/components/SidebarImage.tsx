import { connect } from 'react-redux';
import React, { Component } from 'react';

import {
    CardType,
    Dispatch,
    ImageArray,
    ImageInfo,
    PlaceholderType,
    cardSetAddImagePlaceholder,
    cardSetChangeImage,
    cardSetLockActivePlaceholder,
    cardSetLowerActivePlaceholderToBottom,
    cardSetRaiseActivePlaceholderToTop,
    cardSetRemoveActivePlaceholder,
    cardSetUnlockActivePlaceholder,
    imageListRequest,
} from '../actions';
import { State } from '../reducers';
import style from './SidebarImage.module.css';

interface OwnProps {
    visible: boolean;
}

interface StateProps {
    isAuthenticated: boolean;
    activePlaceholder: PlaceholderType | null;
    imageUrl: string;
    activeCard: CardType | null;
    filter: string;
    images: ImageArray;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = StateProps & DispatchProps & OwnProps;

export class SidebarImage extends Component<Props> {
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

    handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { dispatch } = this.props;
        dispatch(imageListRequest(event.target.value));
    };

    handleImageSelect = (imageName: string) => {
        const { dispatch, activeCard, activePlaceholder } = this.props;

        if (activeCard && activePlaceholder) {
            const ii: ImageInfo = { url: `/api/imagefiles/${imageName}` };
            dispatch(cardSetChangeImage(activeCard.id, activePlaceholder.id, ii));
        }
    };

    handleRaiseToTop = () => {
        const { activePlaceholder, dispatch } = this.props;
        if (activePlaceholder !== null) {
            dispatch(cardSetRaiseActivePlaceholderToTop());
        }
    };

    handleLowerToBottom = () => {
        const { activePlaceholder, dispatch } = this.props;
        if (activePlaceholder !== null) {
            dispatch(cardSetLowerActivePlaceholderToBottom());
        }
    };

    handleLockField = () => {
        const { activePlaceholder, dispatch } = this.props;
        if (activePlaceholder !== null) {
            dispatch(cardSetLockActivePlaceholder());
        }
    };

    handleUnlockField = () => {
        const { activePlaceholder, dispatch } = this.props;
        if (activePlaceholder !== null) {
            dispatch(cardSetUnlockActivePlaceholder());
        }
    };

    render() {
        const { activePlaceholder, imageUrl, filter, visible } = this.props;

        return (
            <div className={style.view} style={{ display: visible ? 'grid' : 'none' }}>
                <div>
                    <button onClick={this.handleAddImageClick} title="Add image field">
                        <i className="material-icons">add_photo_alternate</i>
                    </button>

                    <button onClick={this.handleRaiseToTop} title="Raise image to top">
                        <i className="material-icons">arrow_upward</i>
                    </button>
                    <button onClick={this.handleLowerToBottom} title="Lower image to bottom">
                        <i className="material-icons">arrow_downward</i>
                    </button>

                    {activePlaceholder !== null && !activePlaceholder.locked && (
                        <button
                            onClick={this.handleLockField}
                            title="Lock image field. Locked field can't be dragged, rotated, resized and removed."
                        >
                            <i className="material-icons">lock_open</i>
                        </button>
                    )}

                    {activePlaceholder !== null && activePlaceholder.locked && (
                        <button
                            onClick={this.handleUnlockField}
                            title="Unlock image field. Unlocked text field can be dragged, rotated, resized and removed."
                        >
                            <i className="material-icons">lock</i>
                        </button>
                    )}

                    <button
                        className={activePlaceholder === null || activePlaceholder.locked ? style.disabled : ''}
                        onClick={this.handleRemoveClick}
                        title="Remove field"
                    >
                        <i className="material-icons">remove</i>
                    </button>
                </div>

                {activePlaceholder && activePlaceholder.type === 'image' && (
                    <>
                        <div className={style.image}>
                            <img src={imageUrl} alt="" />
                        </div>

                        <div>
                            <input type="text" value={filter} onChange={this.handleFilterChange} />
                        </div>

                        <div className={style.images}>
                            {this.props.images.map(im => {
                                return (
                                    <img
                                        key={im.id}
                                        src={`/api/imagefiles/${im.name}`}
                                        onClick={() => this.handleImageSelect(im.name)}
                                        alt=""
                                    />
                                );
                            })}
                        </div>
                    </>
                )}
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
        images: state.images.images,
        filter: state.images.filter,
    };
};

export default connect<StateProps, DispatchProps, OwnProps, State>(mapStateToProps)(SidebarImage);
