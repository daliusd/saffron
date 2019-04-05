import { connect } from 'react-redux';
import React, { Component } from 'react';

import { DispatchProps, SidebarOwnProps } from '../types';
import {
    IdsArray,
    PlaceholderType,
    PlaceholdersCollection,
    cardSetActiveCardAndPlaceholder,
    cardSetChangeActivePlaceholderName,
    cardSetChangePlaceholderAngle,
    cardSetChangePlaceholderPosition,
    cardSetChangePlaceholderSize,
    cardSetLockActivePlaceholder,
    cardSetLowerActivePlaceholderToBottom,
    cardSetRaiseActivePlaceholderToTop,
    cardSetUnlockActivePlaceholder,
} from '../actions';
import { State } from '../reducers';
import style from './SidebarMeasurements.module.css';

interface StateProps {
    activePlaceholder: PlaceholderType | null;
    activeCard: string | null;
    placeholders: PlaceholdersCollection;
    placeholdersAllIds: IdsArray;
}

type Props = StateProps & DispatchProps & SidebarOwnProps;

export class SidebarMeasurements extends Component<Props> {
    handlePrevPlaceholder = () => {
        const { activeCard, activePlaceholder, placeholders, placeholdersAllIds, dispatch } = this.props;
        if (placeholdersAllIds.length === 0 || activeCard === null) return;

        let prevPlaceholder = placeholdersAllIds[placeholdersAllIds.length - 1];
        if (activePlaceholder !== null) {
            let idx = placeholdersAllIds.indexOf(activePlaceholder.id);
            if (idx > 0) prevPlaceholder = placeholdersAllIds[idx - 1];
        }

        dispatch(
            cardSetActiveCardAndPlaceholder(
                activeCard,
                placeholders[prevPlaceholder].isOnBack || false,
                prevPlaceholder,
            ),
        );
    };

    handleNextPlaceholder = () => {
        const { activeCard, activePlaceholder, placeholders, placeholdersAllIds, dispatch } = this.props;
        if (placeholdersAllIds.length === 0 || activeCard === null) return;

        let nextPlaceholder = placeholdersAllIds[0];
        if (activePlaceholder !== null) {
            let idx = placeholdersAllIds.indexOf(activePlaceholder.id);
            if (idx !== -1 && idx !== placeholdersAllIds.length - 1) nextPlaceholder = placeholdersAllIds[idx + 1];
        }

        dispatch(
            cardSetActiveCardAndPlaceholder(
                activeCard,
                placeholders[nextPlaceholder].isOnBack || false,
                nextPlaceholder,
            ),
        );
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

    handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { activePlaceholder, dispatch } = this.props;
        const name = event.target.value.trim();
        if (activePlaceholder !== null) {
            dispatch(cardSetChangeActivePlaceholderName(name));
        }
    };

    handleWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { activePlaceholder, dispatch } = this.props;
        const width = parseFloat(event.target.value);
        if (activePlaceholder !== null) {
            dispatch(cardSetChangePlaceholderSize(activePlaceholder, width, activePlaceholder.height));
        }
    };

    handleHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { activePlaceholder, dispatch } = this.props;
        const height = parseFloat(event.target.value);
        if (activePlaceholder !== null) {
            dispatch(cardSetChangePlaceholderSize(activePlaceholder, activePlaceholder.width, height));
        }
    };

    handleXChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { activePlaceholder, dispatch } = this.props;
        const x = parseFloat(event.target.value);
        if (activePlaceholder !== null) {
            dispatch(cardSetChangePlaceholderPosition(activePlaceholder, x, activePlaceholder.y));
        }
    };

    handleYChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { activePlaceholder, dispatch } = this.props;
        const y = parseFloat(event.target.value);
        if (activePlaceholder !== null) {
            dispatch(cardSetChangePlaceholderPosition(activePlaceholder, activePlaceholder.x, y));
        }
    };

    handleAngleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { activePlaceholder, dispatch } = this.props;
        const angle = (parseFloat(event.target.value) * Math.PI) / 180;
        if (activePlaceholder !== null) {
            dispatch(cardSetChangePlaceholderAngle(activePlaceholder, angle));
        }
    };

    render() {
        const { activeCard, activePlaceholder, visible } = this.props;

        return (
            <div className={style.view} style={{ display: visible ? 'initial' : 'none' }}>
                {activeCard !== null && (
                    <>
                        <button onClick={this.handlePrevPlaceholder} title="Previous placeholder">
                            <i className="material-icons">arrow_back</i>
                        </button>
                        <button onClick={this.handleNextPlaceholder} title="Next placeholder">
                            <i className="material-icons">arrow_forward</i>
                        </button>
                    </>
                )}

                {activePlaceholder !== null && (
                    <>
                        <button onClick={this.handleRaiseToTop} title="Raise to top">
                            <i className="material-icons">arrow_upward</i>
                        </button>
                        <button onClick={this.handleLowerToBottom} title="Lower to bottom">
                            <i className="material-icons">arrow_downward</i>
                        </button>
                    </>
                )}

                {activePlaceholder !== null && !activePlaceholder.locked && (
                    <button
                        onClick={this.handleLockField}
                        title="Lock field. Locked field can't be dragged, rotated, resized and removed."
                    >
                        <i className="material-icons">lock_open</i>
                    </button>
                )}

                {activePlaceholder !== null && activePlaceholder.locked && (
                    <button
                        onClick={this.handleUnlockField}
                        title="Unlock field. Unlocked field can be dragged, rotated, resized and removed."
                    >
                        <i className="material-icons">lock</i>
                    </button>
                )}

                {activePlaceholder !== null && (
                    <div>
                        <label>
                            Field name:
                            <input
                                type="text"
                                value={activePlaceholder.name || ''}
                                placeholder={activePlaceholder.id}
                                onChange={this.handleNameChange}
                                title="Change name of field."
                            />
                        </label>

                        <label>
                            Width:
                            <input
                                type="number"
                                step="any"
                                value={activePlaceholder.width}
                                placeholder="Width"
                                onChange={this.handleWidthChange}
                                title="Change width of field."
                            />
                        </label>

                        <label>
                            Height:
                            <input
                                type="number"
                                step="any"
                                value={activePlaceholder.height}
                                placeholder="Height"
                                onChange={this.handleHeightChange}
                                title="Change width of field."
                            />
                        </label>

                        <label>
                            X:
                            <input
                                type="number"
                                step="any"
                                value={activePlaceholder.x}
                                placeholder="Width"
                                onChange={this.handleXChange}
                                title="Change x coordinate of field."
                            />
                        </label>

                        <label>
                            Y:
                            <input
                                type="number"
                                step="any"
                                value={activePlaceholder.y}
                                placeholder="Height"
                                onChange={this.handleYChange}
                                title="Change y coordinate of field."
                            />
                        </label>

                        <label>
                            Angle:
                            <input
                                type="number"
                                step="any"
                                value={(activePlaceholder.angle * 180) / Math.PI}
                                placeholder="Angle"
                                onChange={this.handleAngleChange}
                                title="Change rotation angle of field."
                            />
                        </label>
                    </div>
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

    return {
        activePlaceholder,
        activeCard: state.cardsets.activeCard,
        placeholders: state.cardsets.placeholders,
        placeholdersAllIds: state.cardsets.placeholdersAllIds,
    };
};

export default connect<StateProps, DispatchProps, SidebarOwnProps, State>(mapStateToProps)(SidebarMeasurements);
