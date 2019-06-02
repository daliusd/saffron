import { ColorResult } from 'react-color';
import { connect } from 'react-redux';
import React, { Component } from 'react';

import { DispatchProps, IdsArray, ImageArray, SidebarOwnProps, FieldInfo, ImageInfo } from '../types';
import { State } from '../reducers';
import {
    cardSetAddImageField,
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
    activeFieldInfo?: FieldInfo;
    crop: boolean;
    activeCardId?: string;
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
        dispatch(cardSetAddImageField());
    };

    changeImage = (ii: ImageInfo) => {
        const { cardsAllIds, activeCardId, activeFieldInfo, dispatch } = this.props;
        const { applyToAllCards } = this.state;

        if (activeFieldInfo) {
            if (applyToAllCards) {
                for (const cardId of cardsAllIds) {
                    dispatch(cardSetChangeImage(cardId, activeFieldInfo.id, ii));
                }
            } else if (activeCardId) {
                dispatch(cardSetChangeImage(activeCardId, activeFieldInfo.id, ii));
            }
        }
    };

    handleRemoveImageFromFieldClick = () => {
        const ii: ImageInfo = { url: undefined, base64: undefined };
        this.changeImage(ii);
    };

    handleRemoveClick = () => {
        const { activeFieldInfo, dispatch } = this.props;
        if (activeFieldInfo !== undefined) {
            dispatch(cardSetRemoveActivePlaceholder());
        }
    };

    handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { activeFieldInfo, dispatch } = this.props;
        const name = event.target.value.trim();
        if (activeFieldInfo !== undefined) {
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
        const { activeFieldInfo } = this.props;

        if (activeFieldInfo !== undefined) {
            const color = activeFieldInfo && activeFieldInfo.color;

            const ii: ImageInfo = { url: `/api/imagefiles/${imageName}`, color, base64: undefined };
            this.changeImage(ii);
        }
    };

    handleRaiseToTop = () => {
        const { activeFieldInfo, dispatch } = this.props;
        if (activeFieldInfo !== undefined) {
            dispatch(cardSetRaiseActivePlaceholderToTop());
        }
    };

    handleLowerToBottom = () => {
        const { activeFieldInfo, dispatch } = this.props;
        if (activeFieldInfo !== undefined) {
            dispatch(cardSetLowerActivePlaceholderToBottom());
        }
    };

    handleLockField = () => {
        const { activeFieldInfo, dispatch } = this.props;
        if (activeFieldInfo !== undefined) {
            dispatch(cardSetLockActivePlaceholder());
        }
    };

    handleUnlockField = () => {
        const { activeFieldInfo, dispatch } = this.props;
        if (activeFieldInfo !== undefined) {
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
        const { activeFieldInfo, dispatch } = this.props;
        if (activeFieldInfo !== undefined) {
            dispatch(cardSetChangeCropForActivePlaceholder(event.target.checked));
        }
    };

    render() {
        const { activeFieldInfo, crop, filter, visible } = this.props;
        const { location, applyToAllCards } = this.state;

        return (
            <div className={style.view} style={{ display: visible ? 'grid' : 'none' }}>
                <div>
                    <button onClick={this.handleAddImageClick} title="Add image field">
                        <i className="material-icons">add_photo_alternate</i>
                    </button>

                    {activeFieldInfo !== undefined && (
                        <>
                            <button onClick={this.handleRaiseToTop} title="Raise image to top">
                                <i className="material-icons">arrow_upward</i>
                            </button>
                            <button onClick={this.handleLowerToBottom} title="Lower image to bottom">
                                <i className="material-icons">arrow_downward</i>
                            </button>
                        </>
                    )}

                    {activeFieldInfo &&
                        activeFieldInfo.type === 'image' &&
                        (activeFieldInfo.url || activeFieldInfo.base64) && (
                            <button onClick={this.handleRemoveImageFromFieldClick} title="Remove image from field">
                                <i className="material-icons">remove_circle_outline</i>
                            </button>
                        )}

                    {activeFieldInfo !== undefined && !activeFieldInfo.locked && (
                        <button
                            onClick={this.handleLockField}
                            title="Lock image field. Locked field can't be dragged, rotated, resized and removed."
                        >
                            <i className="material-icons">lock_open</i>
                        </button>
                    )}

                    {activeFieldInfo !== undefined && activeFieldInfo.locked && (
                        <button
                            onClick={this.handleUnlockField}
                            title="Unlock image field. Unlocked text field can be dragged, rotated, resized and removed."
                        >
                            <i className="material-icons">lock</i>
                        </button>
                    )}

                    <button
                        className={activeFieldInfo === undefined || activeFieldInfo.locked ? style.disabled : ''}
                        onClick={this.handleRemoveClick}
                        title="Remove field"
                    >
                        <i className="material-icons">remove</i>
                    </button>

                    {activeFieldInfo !== undefined && (
                        <input
                            type="text"
                            value={activeFieldInfo.name || ''}
                            placeholder={activeFieldInfo.id}
                            onChange={this.handleNameChange}
                            title="Change name of image field."
                        />
                    )}

                    {activeFieldInfo && activeFieldInfo.type === 'image' && (
                        <form>
                            <div>
                                Fit:
                                <label>
                                    <input
                                        type="radio"
                                        value="width"
                                        checked={!activeFieldInfo.fit || activeFieldInfo.fit === 'width'}
                                        onChange={this.handleFitOptionChange}
                                    />
                                    width
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        value="height"
                                        checked={activeFieldInfo.fit === 'height'}
                                        onChange={this.handleFitOptionChange}
                                    />
                                    height
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        value="stretch"
                                        checked={activeFieldInfo.fit === 'stretch'}
                                        onChange={this.handleFitOptionChange}
                                    />
                                    stretch
                                </label>
                            </div>
                        </form>
                    )}
                </div>

                {activeFieldInfo && activeFieldInfo.type === 'image' && (
                    <>
                        <div>
                            <label>
                                <input type="checkbox" checked={crop} onChange={this.handleChangeCrop} />
                                Crop
                            </label>
                            <ColorButton
                                color={(activeFieldInfo && activeFieldInfo.color) || '#FFFFFF'}
                                onChange={this.handleColorChange}
                            />
                            {activeFieldInfo && activeFieldInfo.color && (
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
    const activeFieldInfo =
        state.cardset.activeCardId !== undefined && state.cardset.activeFieldId !== undefined
            ? state.cardset.fields[state.cardset.activeCardId][state.cardset.activeFieldId]
            : undefined;

    const activeCardId = state.cardset.activeCardId;

    return {
        isAuthenticated: state.auth.isAuthenticated,
        activeFieldInfo,
        crop: activeFieldInfo && activeFieldInfo.type === 'image' ? activeFieldInfo.crop || false : false,
        activeCardId,
        images: state.images.images,
        filter: state.images.filter,
        cardsAllIds: state.cardset.cardsAllIds,
    };
};

export default connect<StateProps, DispatchProps, SidebarOwnProps, State>(mapStateToProps)(SidebarImage);
