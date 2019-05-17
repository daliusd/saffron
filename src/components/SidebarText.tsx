import { ColorResult } from 'react-color';
import { connect } from 'react-redux';
import React, { Component } from 'react';

import { DispatchProps, PlaceholderType, SidebarOwnProps } from '../types';
import { State } from '../reducers';
import {
    cardSetAddTextPlaceholder,
    cardSetChangeActivePlaceholderName,
    cardSetChangeActiveTextPlaceholderAlign,
    cardSetLockActivePlaceholder,
    cardSetLowerActivePlaceholderToBottom,
    cardSetRaiseActivePlaceholderToTop,
    cardSetRemoveActivePlaceholder,
    cardSetUnlockActivePlaceholder,
    cardSetChangeActiveTextPlaceholderColor,
} from '../actions';
import ColorButton from './ColorButton';
import FontSelector from './FontSelector';
import style from './SidebarText.module.css';

interface StateProps {
    isAuthenticated: boolean;
    activePlaceholder: PlaceholderType | null;
}

type Props = StateProps & DispatchProps & SidebarOwnProps;

export class SidebarText extends Component<Props> {
    handleAddTextClick = () => {
        const { dispatch } = this.props;
        dispatch(cardSetAddTextPlaceholder());
    };

    handleSetTextAlignLeft = () => {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        if (selection.rangeCount === 1 && range.collapsed) {
            const { dispatch } = this.props;
            dispatch(cardSetChangeActiveTextPlaceholderAlign('left'));
        } else {
            document.execCommand('justifyleft');
        }
    };

    handleSetTextAlignCenter = () => {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        if (selection.rangeCount === 1 && range.collapsed) {
            const { dispatch } = this.props;
            dispatch(cardSetChangeActiveTextPlaceholderAlign('center'));
        } else {
            document.execCommand('justifycenter');
        }
    };

    handleSetTextAlignRight = () => {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        if (selection.rangeCount === 1 && range.collapsed) {
            const { dispatch } = this.props;
            dispatch(cardSetChangeActiveTextPlaceholderAlign('right'));
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
        const { activePlaceholder, dispatch } = this.props;
        if (activePlaceholder !== null) {
            dispatch(cardSetRemoveActivePlaceholder());
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

    handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { activePlaceholder, dispatch } = this.props;
        const name = event.target.value.trim();
        if (activePlaceholder !== null) {
            dispatch(cardSetChangeActivePlaceholderName(name));
        }
    };

    handleColorChange = (color: ColorResult) => {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        if (selection.rangeCount === 1 && range.collapsed) {
            const { dispatch } = this.props;
            dispatch(cardSetChangeActiveTextPlaceholderColor(color.hex));
        } else {
            document.execCommand('forecolor', false, color.hex);
        }
    };

    render() {
        const { activePlaceholder, visible } = this.props;

        let color = '#000000';
        if (activePlaceholder && activePlaceholder.type === 'text' && activePlaceholder.color) {
            color = activePlaceholder.color;
        }

        return (
            <div className={style.view} style={{ display: visible ? 'initial' : 'none' }}>
                <button onClick={this.handleAddTextClick} title="Add text field">
                    <i className="material-icons">text_fields</i>
                </button>
                {activePlaceholder !== null && (
                    <>
                        <button onClick={this.handleRaiseToTop} title="Raise text to top">
                            <i className="material-icons">arrow_upward</i>
                        </button>
                        <button onClick={this.handleLowerToBottom} title="Lower text to bottom">
                            <i className="material-icons">arrow_downward</i>
                        </button>
                    </>
                )}

                {activePlaceholder !== null && !activePlaceholder.locked && (
                    <button
                        onClick={this.handleLockField}
                        title="Lock text field. Locked field can't be dragged, rotated, resized and removed."
                    >
                        <i className="material-icons">lock_open</i>
                    </button>
                )}

                {activePlaceholder !== null && activePlaceholder.locked && (
                    <button
                        onClick={this.handleUnlockField}
                        title="Unlock text field. Unlocked text field can be dragged, rotated, resized and removed."
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
    const activePlaceholder =
        state.cardsets.activePlaceholder !== null
            ? state.cardsets.placeholders[state.cardsets.activePlaceholder]
            : null;

    return {
        isAuthenticated: state.auth.isAuthenticated,
        activePlaceholder,
    };
};

export default connect<StateProps, DispatchProps, SidebarOwnProps, State>(mapStateToProps)(SidebarText);
