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
    cardSetRemoveActivePlaceholder,
    imageListRequest,
} from '../actions';
import { State } from '../reducers';
import style from './SidebarImage.module.css';

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

type Props = StateProps & DispatchProps;

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

    render() {
        const { activePlaceholder, imageUrl, filter } = this.props;

        return (
            <div className={style.view}>
                <div>
                    <button onClick={this.handleAddImageClick} title="Add image field">
                        <i className="material-icons">add_photo_alternate</i>
                    </button>

                    <button
                        className={activePlaceholder === null ? style.disabled : ''}
                        onClick={this.handleRemoveClick}
                        title="Remove field"
                    >
                        <i className="material-icons">remove</i>
                    </button>
                </div>

                <div>
                    <img
                        src={imageUrl}
                        alt=""
                        style={{
                            width: 100,
                            height: 100,
                        }}
                    />
                </div>

                <div>
                    <input type="text" value={filter} onChange={this.handleFilterChange} />
                </div>

                <div>
                    {this.props.images.map(im => {
                        return (
                            <img
                                key={im.id}
                                src={`/api/imagefiles/${im.name}`}
                                onClick={() => this.handleImageSelect(im.name)}
                                alt=""
                                style={{
                                    width: 100,
                                    height: 100,
                                }}
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

export default connect<StateProps, DispatchProps, {}, State>(mapStateToProps)(SidebarImage);
