// @flow
import { ChromePicker } from 'react-color';
import { connect } from 'react-redux';
import React, { Component } from 'react';

import { type Dispatch, cardSetChangeActiveTextPlaceholderColor } from '../actions';

type Props = {
    dispatch: Dispatch,
};
type State = {
    displayColorPicker: boolean,
};

class ColorButton extends Component<Props, State> {
    state = {
        displayColorPicker: false,
    };

    handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker });
    };

    handleClose = () => {
        this.setState({ displayColorPicker: false });
    };

    handleChange = (color: any) => {
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
        const popover = {
            position: 'absolute',
            zIndex: '2',
        };
        const cover = {
            position: 'fixed',
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px',
        };
        return (
            <div>
                <button onClick={this.handleClick}>Cl</button>
                {this.state.displayColorPicker ? (
                    <div style={popover}>
                        <div style={cover} onClick={this.handleClose} />
                        <ChromePicker disableAlpha={true} onChange={this.handleChange} />
                    </div>
                ) : null}
            </div>
        );
    }
}

export default connect()(ColorButton);
