import { connect } from 'react-redux';
import React, { Component } from 'react';

import { ACTIVITY_CREATING_PNG, State } from '../reducers';
import { DispatchProps, SidebarOwnProps } from '../types';
import { gameCreatePngRequest } from '../actions';
import style from './SidebarGeneratePng.module.css';

interface StateProps {
    width: number;
    height: number;
    isCreatingPng: boolean;
}

type Props = StateProps & DispatchProps & SidebarOwnProps;

interface LocalState {
    dpi: number;
}

export class SidebarGeneratePng extends Component<Props, LocalState> {
    state: LocalState = {
        dpi: 300,
    };

    handleDpiChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ dpi: parseInt(event.target.value) });
    };

    handleGenerate = () => {
        const { dispatch } = this.props;
        const { dpi } = this.state;

        dispatch(gameCreatePngRequest(dpi));
    };

    render() {
        const { visible, width, height, isCreatingPng } = this.props;
        const { dpi } = this.state;

        const calculatedWidth = Math.round(dpi * (width / 25.4 + 1 / 4));
        const calculatedHeight = Math.round(dpi * (height / 25.4 + 1 / 4));

        return (
            <div className={style.view} style={{ display: visible ? 'grid' : 'none' }}>
                <div>Here you can generate your cards as PNG images.</div>
                <label htmlFor="dpi">DPI:</label>
                <input
                    id="dpi"
                    type="number"
                    min="1"
                    step="1"
                    onChange={this.handleDpiChange}
                    className="form-control"
                    placeholder="DPI"
                    value={dpi}
                />

                <div>Width in pixels: {calculatedWidth}</div>
                <div>Height in pixels: {calculatedHeight}</div>

                <button disabled={isCreatingPng} onClick={this.handleGenerate}>
                    Generate
                </button>
            </div>
        );
    }
}

const mapStateToProps = (state: State): StateProps => {
    return {
        width: state.cardsets.width,
        height: state.cardsets.height,
        isCreatingPng: (state.games.activity & ACTIVITY_CREATING_PNG) === ACTIVITY_CREATING_PNG,
    };
};

export default connect<StateProps, DispatchProps, SidebarOwnProps, State>(mapStateToProps)(SidebarGeneratePng);
