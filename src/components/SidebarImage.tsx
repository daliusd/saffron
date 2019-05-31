import { ColorResult } from 'react-color';
import { connect } from 'react-redux';
import React, { Component } from 'react';

import { CardType, DispatchProps, IdsArray, ImageArray, ImageInfo, PlaceholderType, SidebarOwnProps } from '../types';
import { State } from '../reducers';
import {
    cardSetAddImagePlaceholder,
    cardSetChangeActivePlaceholderName,
    cardSetChangeFitForActivePlaceholder,
    cardSetChangeCropForActivePlaceholder,
    cardSetChangeImage,
    cardSetLockActivePlaceholder,
    cardSetLowerActivePlaceholderToBottom,
    cardSetRaiseActivePlaceholderToTop,
    cardSetRemoveActivePlaceholder,
    cardSetUnlockActivePlaceholder,
    imageListRequest,
} from '../actions';
import ColorButton from './ColorButton';
import style from './SidebarImage.module.css';

interface StateProps {
    isAuthenticated: boolean;
    activePlaceholder: PlaceholderType | null;
    imageInfo?: ImageInfo;
    activeCard: CardType | null;
    filter: string;
    images: ImageArray;
    cardsAllIds: IdsArray;
}

type Props = StateProps & DispatchProps & SidebarOwnProps;

interface LocalState {
    location: string;
    applyToAllCards: boolean;
}

export class SidebarImage extends Component<Props, LocalState> {
    state = {
        location: 'all',
        applyToAllCards: false,
    };

    handleAddImageClick = () => {
        const { dispatch } = this.props;
        dispatch(cardSetAddImagePlaceholder());
    };

    changeImage = (ii: ImageInfo) => {
        const { cardsAllIds, activeCard, activePlaceholder, dispatch } = this.props;
        const { applyToAllCards } = this.state;

        if (activePlaceholder) {
            if (applyToAllCards) {
                for (const cardId of cardsAllIds) {
                    dispatch(cardSetChangeImage(cardId, activePlaceholder.id, ii));
                }
            } else if (activeCard) {
                dispatch(cardSetChangeImage(activeCard.id, activePlaceholder.id, ii));
            }
        }
    };

    handleRemoveImageFromFieldClick = () => {
        const ii: ImageInfo = { url: undefined, base64: undefined };
        this.changeImage(ii);
    };

    handleRemoveClick = () => {
        const { activePlaceholder, dispatch } = this.props;
        if (activePlaceholder !== null) {
            dispatch(cardSetRemoveActivePlaceholder());
        }
    };

    handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { activePlaceholder, dispatch } = this.props;
        const name = event.target.value.trim();
        if (activePlaceholder !== null) {
            dispatch(cardSetChangeActivePlaceholderName(name));
        }
    };

    handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { dispatch } = this.props;
        const { location } = this.state;
        const filter = event.target.value;
        dispatch(imageListRequest(filter, location));
    };

    handleImageSelect = (imageName: string) => {
        const { imageInfo, activePlaceholder } = this.props;

        if (activePlaceholder !== null) {
            const color = imageInfo && imageInfo.color;

            const ii: ImageInfo = { url: `/api/imagefiles/${imageName}`, color, base64: undefined };
            this.changeImage(ii);
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

    handleFitOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { dispatch } = this.props;
        const fit = event.target.value;

        dispatch(cardSetChangeFitForActivePlaceholder(fit));
    };

    handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { filter, dispatch } = this.props;
        const location = event.target.value;

        this.setState({ location });
        dispatch(imageListRequest(filter, location));
    };

    handleColorChange = (color: ColorResult) => {
        const ii: ImageInfo = { color: color.hex };
        this.changeImage(ii);
    };

    handleRemoveColorClick = () => {
        const ii: ImageInfo = { color: undefined };
        this.changeImage(ii);
    };

    handleApplyToAllCardChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ applyToAllCards: event.target.checked });
    };

    handleChangeCrop = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { activePlaceholder, dispatch } = this.props;
        if (activePlaceholder !== null) {
            dispatch(cardSetChangeCropForActivePlaceholder(event.target.checked));
        }
    };

    render() {
        const { activePlaceholder, imageInfo, filter, visible } = this.props;
        const { location, applyToAllCards } = this.state;

        return (
            <div className={style.view} style={{ display: visible ? 'grid' : 'none' }}>
                <div>
                    <button onClick={this.handleAddImageClick} title="Add image field">
                        <i className="material-icons">add_photo_alternate</i>
                    </button>

                    {activePlaceholder !== null && (
                        <>
                            <button onClick={this.handleRaiseToTop} title="Raise image to top">
                                <i className="material-icons">arrow_upward</i>
                            </button>
                            <button onClick={this.handleLowerToBottom} title="Lower image to bottom">
                                <i className="material-icons">arrow_downward</i>
                            </button>
                        </>
                    )}

                    {imageInfo && (
                        <button onClick={this.handleRemoveImageFromFieldClick} title="Remove image from field">
                            <i className="material-icons">remove_circle_outline</i>
                        </button>
                    )}

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

                    {activePlaceholder !== null && (
                        <input
                            type="text"
                            value={activePlaceholder.name || ''}
                            placeholder={activePlaceholder.id}
                            onChange={this.handleNameChange}
                            title="Change name of image field."
                        />
                    )}

                    {activePlaceholder && activePlaceholder.type === 'image' && (
                        <form>
                            <div>
                                Fit:
                                <label>
                                    <input
                                        type="radio"
                                        value="width"
                                        checked={!activePlaceholder.fit || activePlaceholder.fit === 'width'}
                                        onChange={this.handleFitOptionChange}
                                    />
                                    width
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        value="height"
                                        checked={activePlaceholder.fit === 'height'}
                                        onChange={this.handleFitOptionChange}
                                    />
                                    height
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        value="stretch"
                                        checked={activePlaceholder.fit === 'stretch'}
                                        onChange={this.handleFitOptionChange}
                                    />
                                    stretch
                                </label>
                            </div>
                        </form>
                    )}
                </div>

                {activePlaceholder && activePlaceholder.type === 'image' && (
                    <>
                        <div>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={activePlaceholder.crop}
                                    onChange={this.handleChangeCrop}
                                />
                                Crop
                            </label>
                            <ColorButton
                                color={(imageInfo && imageInfo.color) || '#FFFFFF'}
                                onChange={this.handleColorChange}
                            />
                            {imageInfo && imageInfo.color && (
                                <button onClick={this.handleRemoveColorClick} title="Remove color">
                                    <i className="material-icons">remove_circle</i>
                                </button>
                            )}
                            <label>
                                <input
                                    type="checkbox"
                                    checked={applyToAllCards}
                                    onChange={this.handleApplyToAllCardChange}
                                />
                                Apply to all cards
                            </label>
                        </div>
                    </>
                )}
                <div>
                    <form>
                        Source:
                        <label>
                            <input
                                type="radio"
                                value="all"
                                checked={location === 'all'}
                                onChange={this.handleOptionChange}
                            />
                            All
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="user"
                                checked={location === 'user'}
                                onChange={this.handleOptionChange}
                            />
                            User
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="game"
                                checked={location === 'game'}
                                onChange={this.handleOptionChange}
                            />
                            Game
                        </label>
                    </form>
                </div>

                <div>
                    <input type="text" placeholder="Search..." value={filter} onChange={this.handleFilterChange} />
                </div>
                <div className={style.images}>
                    {this.props.images.map(im => {
                        return (
                            <img
                                key={im.id}
                                src={`/api/imagefiles/${im.name}`}
                                data-width={im.width}
                                data-height={im.height}
                                onClick={() => this.handleImageSelect(im.name)}
                                alt={im.name}
                            />
                        );
                    })}
                </div>
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

    let imageInfo = undefined;

    if (
        state.cardsets.images &&
        activeCard &&
        state.cardsets.images[activeCard.id] &&
        activePlaceholder !== null &&
        activePlaceholder.type === 'image' &&
        state.cardsets.images[activeCard.id][activePlaceholder.id]
    ) {
        imageInfo = state.cardsets.images[activeCard.id][activePlaceholder.id];
    }

    return {
        isAuthenticated: state.auth.isAuthenticated,
        activePlaceholder,
        imageInfo,
        activeCard,
        images: state.images.images,
        filter: state.images.filter,
        cardsAllIds: state.cardsets.cardsAllIds,
    };
};

export default connect<StateProps, DispatchProps, SidebarOwnProps, State>(mapStateToProps)(SidebarImage);
