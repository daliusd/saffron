import { connect } from 'react-redux';
import React, { Component } from 'react';

import { DispatchProps, IdsArray, SidebarOwnProps, FieldInfo, FieldInfoByCardCollection } from '../types';
import { State } from '../reducers';
import {
    cardSetActiveCardAndField,
    cardSetChangeActivePlaceholderName,
    cardSetChangeFieldAngle,
    cardSetChangeFieldSize,
    cardSetLockActivePlaceholder,
    cardSetChangeFieldPosition,
    cardSetLowerActivePlaceholderToBottom,
    cardSetRaiseActivePlaceholderToTop,
    cardSetUnlockActivePlaceholder,
} from '../actions';
import style from './SidebarMeasurements.module.css';

interface StateProps {
    activeField?: FieldInfo;
    activeCardId?: string;
    fields: FieldInfoByCardCollection;
    fieldsAllIds: IdsArray;
}

type Props = StateProps & DispatchProps & SidebarOwnProps;

export class SidebarMeasurements extends Component<Props> {
    handlePrevPlaceholder = () => {
        const { activeCardId, activeField, fieldsAllIds, dispatch } = this.props;
        if (fieldsAllIds.length === 0 || activeCardId === null) return;

        let prevField = fieldsAllIds[fieldsAllIds.length - 1];
        if (activeField !== undefined) {
            let idx = fieldsAllIds.indexOf(activeField.id);
            if (idx > 0) prevField = fieldsAllIds[idx - 1];
        }

        dispatch(cardSetActiveCardAndField(activeCardId, (activeField && activeField.isOnBack) || false, prevField));
    };

    handleNextPlaceholder = () => {
        const { activeCardId, activeField, fieldsAllIds, dispatch } = this.props;
        if (fieldsAllIds.length === 0 || activeCardId === null) return;

        let nextField = fieldsAllIds[0];
        if (activeField !== undefined) {
            let idx = fieldsAllIds.indexOf(activeField.id);
            if (idx !== -1 && idx !== fieldsAllIds.length - 1) nextField = fieldsAllIds[idx + 1];
        }

        dispatch(cardSetActiveCardAndField(activeCardId, (activeField && activeField.isOnBack) || false, nextField));
    };

    handleRaiseToTop = () => {
        const { activeField, dispatch } = this.props;
        if (activeField !== undefined) {
            dispatch(cardSetRaiseActivePlaceholderToTop());
        }
    };

    handleLowerToBottom = () => {
        const { activeField, dispatch } = this.props;
        if (activeField !== undefined) {
            dispatch(cardSetLowerActivePlaceholderToBottom());
        }
    };

    handleLockField = () => {
        const { activeField, dispatch } = this.props;
        if (activeField !== undefined) {
            dispatch(cardSetLockActivePlaceholder());
        }
    };

    handleUnlockField = () => {
        const { activeField, dispatch } = this.props;
        if (activeField !== undefined) {
            dispatch(cardSetUnlockActivePlaceholder());
        }
    };

    handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { activeField, dispatch } = this.props;
        const name = event.target.value.trim();
        if (activeField !== undefined) {
            dispatch(cardSetChangeActivePlaceholderName(name));
        }
    };

    handleWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { activeField, dispatch } = this.props;
        const width = parseFloat(event.target.value);
        if (activeField !== undefined) {
            dispatch(cardSetChangeFieldSize(undefined, activeField.id, width, activeField.height));
        }
    };

    handleHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { activeField, dispatch } = this.props;
        const height = parseFloat(event.target.value);
        if (activeField !== undefined) {
            dispatch(cardSetChangeFieldSize(undefined, activeField.id, activeField.width, height));
        }
    };

    handleXChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { activeField, dispatch } = this.props;
        const x = parseFloat(event.target.value);
        if (activeField !== undefined) {
            dispatch(cardSetChangeFieldPosition(undefined, activeField.id, x, activeField.y));
        }
    };

    handleYChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { activeField, dispatch } = this.props;
        const y = parseFloat(event.target.value);
        if (activeField !== undefined) {
            dispatch(cardSetChangeFieldPosition(undefined, activeField.id, activeField.x, y));
        }
    };

    handleAngleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { activeField, dispatch } = this.props;
        const angle = (parseFloat(event.target.value) * Math.PI) / 180;
        if (activeField !== undefined) {
            dispatch(cardSetChangeFieldAngle(undefined, activeField.id, angle));
        }
    };

    render() {
        const { activeCardId, activeField, visible } = this.props;

        return (
            <div className={style.view} style={{ display: visible ? 'initial' : 'none' }}>
                {activeCardId !== undefined && (
                    <>
                        <button onClick={this.handlePrevPlaceholder} title="Previous placeholder">
                            <i className="material-icons">arrow_back</i>
                        </button>
                        <button onClick={this.handleNextPlaceholder} title="Next placeholder">
                            <i className="material-icons">arrow_forward</i>
                        </button>
                    </>
                )}

                {activeField !== undefined && (
                    <>
                        <button onClick={this.handleRaiseToTop} title="Raise to top">
                            <i className="material-icons">arrow_upward</i>
                        </button>
                        <button onClick={this.handleLowerToBottom} title="Lower to bottom">
                            <i className="material-icons">arrow_downward</i>
                        </button>
                    </>
                )}

                {activeField !== undefined && !activeField.locked && (
                    <button
                        onClick={this.handleLockField}
                        title="Lock field. Locked field can't be dragged, rotated, resized and removed."
                    >
                        <i className="material-icons">lock_open</i>
                    </button>
                )}

                {activeField !== undefined && activeField.locked && (
                    <button
                        onClick={this.handleUnlockField}
                        title="Unlock field. Unlocked field can be dragged, rotated, resized and removed."
                    >
                        <i className="material-icons">lock</i>
                    </button>
                )}

                {activeField !== undefined && (
                    <div>
                        <label>
                            Field name:
                            <input
                                type="text"
                                value={activeField.name || ''}
                                placeholder={activeField.id}
                                onChange={this.handleNameChange}
                                title="Change name of field."
                            />
                        </label>

                        <label>
                            Width:
                            <input
                                type="number"
                                step="any"
                                value={activeField.width}
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
                                value={activeField.height}
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
                                value={activeField.x}
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
                                value={activeField.y}
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
                                value={(activeField.angle * 180) / Math.PI}
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
    const activeField =
        state.cardset.activeCardId !== undefined && state.cardset.activeFieldId !== undefined
            ? state.cardset.fields[state.cardset.activeCardId][state.cardset.activeFieldId]
            : undefined;

    return {
        activeField,
        activeCardId: state.cardset.activeCardId,
        fields: state.cardset.fields,
        fieldsAllIds: state.cardset.fieldsAllIds,
    };
};

export default connect<StateProps, DispatchProps, SidebarOwnProps, State>(mapStateToProps)(SidebarMeasurements);
