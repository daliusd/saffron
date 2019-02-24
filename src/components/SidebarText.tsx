import { connect } from 'react-redux';
import React, { Component } from 'react';

import {
    Dispatch,
    PlaceholderType,
    cardSetAddTextPlaceholder,
    cardSetChangeActiveTextPlaceholderAlign,
    cardSetRemoveActivePlaceholder,
} from '../actions';
import { State } from '../reducers';
import ColorButton from './ColorButton';
import FontSelector from './FontSelector';
import style from './SidebarText.module.css';

interface StateProps {
    isAuthenticated: boolean;
    activePlaceholder: PlaceholderType | null;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = StateProps & DispatchProps;

export class SidebarText extends Component<Props> {
    handleAddTextClick = () => {
        const { dispatch } = this.props;
        dispatch(cardSetAddTextPlaceholder());
    };

    handleSetTextAlignLeft = () => {
        const { dispatch } = this.props;
        dispatch(cardSetChangeActiveTextPlaceholderAlign('left'));
    };

    handleSetTextAlignCenter = () => {
        const { dispatch } = this.props;
        dispatch(cardSetChangeActiveTextPlaceholderAlign('center'));
    };

    handleSetTextAlignRight = () => {
        const { dispatch } = this.props;
        dispatch(cardSetChangeActiveTextPlaceholderAlign('right'));
    };

    handleRemoveClick = () => {
        const { activePlaceholder, dispatch } = this.props;
        if (activePlaceholder !== null) {
            dispatch(cardSetRemoveActivePlaceholder());
        }
    };

    render() {
        const { activePlaceholder } = this.props;

        return (
            <div className={style.view}>
                <button onClick={this.handleAddTextClick} title="Add text field">
                    <i className="material-icons">text_fields</i>
                </button>
                <button onClick={this.handleSetTextAlignLeft} title="Align text left">
                    <i className="material-icons">format_align_left</i>
                </button>
                <button onClick={this.handleSetTextAlignCenter} title="Align text center">
                    <i className="material-icons">format_align_center</i>
                </button>
                <button onClick={this.handleSetTextAlignRight} title="Align text right">
                    <i className="material-icons">format_align_right</i>
                </button>
                <ColorButton />
                <FontSelector />

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

    return {
        isAuthenticated: state.auth.isAuthenticated,
        activePlaceholder,
    };
};

export default connect<StateProps, DispatchProps, {}, State>(mapStateToProps)(SidebarText);
