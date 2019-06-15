import { ColorResult } from 'react-color';
import { connect } from 'react-redux';
import React, { Component } from 'react';

import { DispatchProps, SidebarOwnProps, FieldInfo } from '../types';
import { State } from '../reducers';
import {
    cardSetAddTextField,
    cardSetChangeActiveFieldName,
    cardSetChangeActiveTextFieldAlign,
    cardSetLockActiveField,
    cardSetLowerActiveFieldToBottom,
    cardSetRaiseActiveFieldToTop,
    cardSetRemoveActiveField,
    cardSetUnlockActiveField,
    cardSetChangeActiveTextFieldColor,
    cardSetRaiseActiveField,
    cardSetLowerActiveField,
} from '../actions';
import ColorButton from './ColorButton';
import FontSelector from './FontSelector';
import style from './SidebarText.module.css';

interface StateProps {
    activeField?: FieldInfo;
}

type Props = StateProps & DispatchProps & SidebarOwnProps;

export class SidebarText extends Component<Props> {
    handleAddTextClick = () => {
        const { dispatch } = this.props;
        dispatch(cardSetAddTextField());
    };

    handleSetTextAlignLeft = () => {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        if (selection.rangeCount === 1 && range.collapsed) {
            const { dispatch } = this.props;
            dispatch(cardSetChangeActiveTextFieldAlign('left'));
        } else {
            document.execCommand('justifyleft');
        }
    };

    handleSetTextAlignCenter = () => {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        if (selection.rangeCount === 1 && range.collapsed) {
            const { dispatch } = this.props;
            dispatch(cardSetChangeActiveTextFieldAlign('center'));
        } else {
            document.execCommand('justifycenter');
        }
    };

    handleSetTextAlignRight = () => {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        if (selection.rangeCount === 1 && range.collapsed) {
            const { dispatch } = this.props;
            dispatch(cardSetChangeActiveTextFieldAlign('right'));
        } else {
            document.execCommand('justifyright');
        }
    };

    handleSetTextBold = () => {
        document.execCommand('bold');
    };

    handleSetTextItalic = () => {
        document.execCommand('italic');
    };

    handleRemoveClick = () => {
        const { activeField, dispatch } = this.props;
        if (activeField !== undefined) {
            dispatch(cardSetRemoveActiveField());
        }
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

    handleColorChange = (color: ColorResult) => {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        if (selection.rangeCount === 1 && range.collapsed) {
            const { dispatch } = this.props;
            dispatch(cardSetChangeActiveTextFieldColor(color.hex));
        } else {
            document.execCommand('forecolor', false, color.hex);
        }
    };

    render() {
        const { activeField, visible } = this.props;

        let color = '#000000';
        if (activeField && activeField.type === 'text' && activeField.color) {
            color = activeField.color;
        }

        return (
            <div className={style.view} style={{ display: visible ? 'initial' : 'none' }}>
                <button onClick={this.handleAddTextClick} title="Add text field">
                    <i className="material-icons">text_fields</i>
                </button>
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
                        title="Lock text field. Locked field can't be dragged, rotated, resized and removed."
                    >
                        <i className="material-icons">lock_open</i>
                    </button>
                )}

                {activeField !== undefined && activeField.locked && (
                    <button
                        onClick={this.handleUnlockField}
                        title="Unlock text field. Unlocked text field can be dragged, rotated, resized and removed."
                    >
                        <i className="material-icons">lock</i>
                    </button>
                )}

                <button
                    className={activeField === undefined || activeField.locked ? style.disabled : ''}
                    onClick={this.handleRemoveClick}
                    title="Remove field"
                >
                    <i className="material-icons">remove</i>
                </button>

                {activeField !== undefined && (
                    <input
                        type="text"
                        value={activeField.name || ''}
                        placeholder={activeField.id}
                        onChange={this.handleNameChange}
                        title="Change name of text field."
                    />
                )}

                <div>
                    <button onClick={this.handleSetTextAlignLeft} title="Align text left">
                        <i className="material-icons">format_align_left</i>
                    </button>
                    <button onClick={this.handleSetTextAlignCenter} title="Align text center">
                        <i className="material-icons">format_align_center</i>
                    </button>
                    <button onClick={this.handleSetTextAlignRight} title="Align text right">
                        <i className="material-icons">format_align_right</i>
                    </button>
                    <button onClick={this.handleSetTextBold} title="Makes selected text bold">
                        <i className="material-icons">format_bold</i>
                    </button>
                    <button onClick={this.handleSetTextItalic} title="Makes selected text italic">
                        <i className="material-icons">format_italic</i>
                    </button>
                    <ColorButton color={color} onChange={this.handleColorChange} />
                    <FontSelector />
                </div>
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
    };
};

export default connect<StateProps, DispatchProps, SidebarOwnProps, State>(mapStateToProps)(SidebarText);
