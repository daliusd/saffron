import { connect } from 'react-redux';
import React, { Component } from 'react';

import { DispatchProps, IdsArray, SidebarOwnProps, FieldInfo, FieldInfoByCardCollection } from '../types';
import { State } from '../reducers';
import {
    cardSetActiveCardAndField,
    cardSetChangeActiveFieldName,
    cardSetChangeFieldAngle,
    cardSetChangeFieldSize,
    cardSetLockActiveField,
    cardSetChangeFieldPosition,
    cardSetLowerActiveField,
    cardSetLowerActiveFieldToBottom,
    cardSetRaiseActiveField,
    cardSetRaiseActiveFieldToTop,
    cardSetUnlockActiveField,
    cardSetChangeUnclickableForActiveField,
} from '../actions';
import style from './SidebarMeasurements.module.css';
import shortid from 'shortid';

interface StateProps {
    activeField?: FieldInfo;
    activeCardId?: string;
    fields: FieldInfoByCardCollection;
    fieldsAllIds: IdsArray;
}

type Props = StateProps & DispatchProps & SidebarOwnProps;

export class SidebarMeasurements extends Component<Props> {
    handlePrevField = () => {
        const { activeCardId, activeField, fieldsAllIds, dispatch } = this.props;
        if (fieldsAllIds.length === 0 || activeCardId === null) return;

        let prevField = fieldsAllIds[fieldsAllIds.length - 1];
        if (activeField !== undefined) {
            let idx = fieldsAllIds.indexOf(activeField.id);
            if (idx > 0) prevField = fieldsAllIds[idx - 1];
        }

        dispatch(cardSetActiveCardAndField(activeCardId, (activeField && activeField.isOnBack) || false, prevField));
    };

    handleNextField = () => {
        const { activeCardId, activeField, fieldsAllIds, dispatch } = this.props;
        if (fieldsAllIds.length === 0 || activeCardId === null) return;

        let nextField = fieldsAllIds[0];
        if (activeField !== undefined) {
            let idx = fieldsAllIds.indexOf(activeField.id);
            if (idx !== -1 && idx !== fieldsAllIds.length - 1) nextField = fieldsAllIds[idx + 1];
        }

        dispatch(cardSetActiveCardAndField(activeCardId, (activeField && activeField.isOnBack) || false, nextField));
    };

    handleRaise = (event: React.MouseEvent) => {
        const { activeField, dispatch } = this.props;
        if (activeField !== undefined) {
            if (event.ctrlKey) {
                dispatch(cardSetRaiseActiveFieldToTop());
            } else {
                dispatch(cardSetRaiseActiveField());
            }
        }
    };

    handleLower = (event: React.MouseEvent) => {
        const { activeField, dispatch } = this.props;
        if (activeField !== undefined) {
            if (event.ctrlKey) {
                dispatch(cardSetLowerActiveFieldToBottom());
            } else {
                dispatch(cardSetLowerActiveField());
            }
        }
    };

    handleLockField = () => {
        const { activeField, dispatch } = this.props;
        if (activeField !== undefined) {
            dispatch(cardSetLockActiveField());
        }
    };

    handleUnlockField = () => {
        const { activeField, dispatch } = this.props;
        if (activeField !== undefined) {
            dispatch(cardSetUnlockActiveField());
        }
    };

    handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { activeField, dispatch } = this.props;
        const name = event.target.value.trim();
        if (activeField !== undefined) {
            dispatch(cardSetChangeActiveFieldName(name));
        }
    };

    handleWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { activeField, dispatch } = this.props;
        const width = parseFloat(event.target.value);
        if (activeField !== undefined) {
            dispatch(cardSetChangeFieldSize(undefined, activeField.id, width, activeField.height, shortid.generate()));
        }
    };

    handleHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { activeField, dispatch } = this.props;
        const height = parseFloat(event.target.value);
        if (activeField !== undefined) {
            dispatch(cardSetChangeFieldSize(undefined, activeField.id, activeField.width, height, shortid.generate()));
        }
    };

    handleXChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { activeField, dispatch } = this.props;
        const x = parseFloat(event.target.value);
        if (activeField !== undefined) {
            dispatch(cardSetChangeFieldPosition(undefined, activeField.id, x, activeField.y, shortid.generate()));
        }
    };

    handleYChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { activeField, dispatch } = this.props;
        const y = parseFloat(event.target.value);
        if (activeField !== undefined) {
            dispatch(cardSetChangeFieldPosition(undefined, activeField.id, activeField.x, y, shortid.generate()));
        }
    };

    handleAngleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { activeField, dispatch } = this.props;
        const angle = (parseFloat(event.target.value) * Math.PI) / 180;
        if (activeField !== undefined) {
            dispatch(cardSetChangeFieldAngle(undefined, activeField.id, angle, shortid.generate()));
        }
    };

    handleChangeUnclickable = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { activeField, dispatch } = this.props;
        if (activeField !== undefined) {
            dispatch(cardSetChangeUnclickableForActiveField(event.target.checked));
        }
    };

    render() {
        const { activeCardId, activeField, visible } = this.props;

        return (
            <div className={style.view} style={{ display: visible ? 'initial' : 'none' }}>
                {activeCardId !== undefined && (
                    <>
                        <button onClick={this.handlePrevField} title="Previous field">
                            <i className="material-icons">arrow_back</i>
                        </button>
                        <button onClick={this.handleNextField} title="Next field">
                            <i className="material-icons">arrow_forward</i>
                        </button>
                    </>
                )}

                {activeField !== undefined && (
                    <>
                        <button onClick={this.handleRaise} title="Raise text (with Ctrl - raise to top)">
                            <i className="material-icons">arrow_upward</i>
                        </button>
                        <button onClick={this.handleLower} title="Lower text (with Ctrl - lower to bottom)">
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
                            Unclickable field:{' '}
                            <input
                                type="checkbox"
                                onChange={this.handleChangeUnclickable}
                                className="form-control"
                                checked={activeField.unclickable ? true : false}
                            />
                        </label>
                    </div>
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
        state.cardset.present.activeCardId !== undefined && state.cardset.present.activeFieldId !== undefined
            ? state.cardset.present.fields[state.cardset.present.activeCardId][state.cardset.present.activeFieldId]
            : undefined;

    return {
        activeField,
        activeCardId: state.cardset.present.activeCardId,
        fields: state.cardset.present.fields,
        fieldsAllIds: state.cardset.present.fieldsAllIds,
    };
};

export default connect<StateProps, DispatchProps, SidebarOwnProps, State>(mapStateToProps)(SidebarMeasurements);
