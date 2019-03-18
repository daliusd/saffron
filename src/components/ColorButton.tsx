import { ChromePicker, ColorResult } from 'react-color';
import React, { Component } from 'react';

interface Props {
    onChange: (color: ColorResult) => void;
    color: string;
}

interface State {
    displayColorPicker: boolean;
}

export default class ColorButton extends Component<Props, State> {
    state = {
        displayColorPicker: false,
    };

    handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker });
    };

    handleClose = () => {
        this.setState({ displayColorPicker: false });
    };

    handleChange = (color: ColorResult) => {
        this.props.onChange(color);
    };

    render() {
        const popover: React.CSSProperties = {
            position: 'absolute',
            zIndex: 2,
        };
        const cover: React.CSSProperties = {
            position: 'fixed',
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px',
        };
        return (
            <>
                <button onClick={this.handleClick} title="Change text color">
                    <i className="material-icons">color_lens</i>
                </button>
                {this.state.displayColorPicker ? (
                    <div style={popover}>
                        <div style={cover} onClick={this.handleClose} />
                        <ChromePicker color={this.props.color} disableAlpha={true} onChange={this.handleChange} />
                    </div>
                ) : null}
            </>
        );
    }
}
