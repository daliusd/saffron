import { connect } from 'react-redux';
import React, { Component } from 'react';

import { DispatchProps, SidebarOwnProps } from '../types';
import { State } from '../reducers';
import {
    cardSetChangeHeight,
    cardSetChangeIsTwoSided,
    cardSetChangeSnappingDistance,
    cardSetChangeWidth,
    cardSetSetZoom,
} from '../actions';
import style from './SidebarSettings.module.css';

interface StateProps {
    width: number;
    height: number;
    isTwoSided: boolean;
    snappingDistance: number;
    zoom: number;
}

type Props = StateProps & DispatchProps & SidebarOwnProps;

export class SidebarDetails extends Component<Props> {
    handleWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { dispatch } = this.props;
        dispatch(cardSetChangeWidth(parseFloat(event.target.value)));
    };

    handleHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { dispatch } = this.props;
        dispatch(cardSetChangeHeight(parseFloat(event.target.value)));
    };

    handleIsTwoSidedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { dispatch } = this.props;
        dispatch(cardSetChangeIsTwoSided(event.target.checked));
    };

    handleZoom = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { dispatch } = this.props;
        dispatch(cardSetSetZoom(parseFloat(event.target.value)));
    };

    handleSnappingDistance = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { dispatch } = this.props;
        dispatch(cardSetChangeSnappingDistance(parseFloat(event.target.value)));
    };

    render() {
        const { width, height, isTwoSided, snappingDistance, visible, zoom } = this.props;

        return (
            <div className={style.view} style={{ display: visible ? 'initial' : 'none' }}>
                <label htmlFor="card_width">Card width (mm):</label>
                <input
                    id="card_width"
                    type="number"
                    min="0"
                    step="0.1"
                    onChange={this.handleWidthChange}
                    className="form-control"
                    placeholder="width"
                    value={width}
                />
                <label htmlFor="card_height">Card height (mm):</label>
                <input
                    id="card_height"
                    type="number"
                    min="0"
                    step="0.1"
                    onChange={this.handleHeightChange}
                    className="form-control"
                    placeholder="height"
                    value={height}
                />
                <label>
                    Cards have two sides:{' '}
                    <input
                        type="checkbox"
                        onChange={this.handleIsTwoSidedChange}
                        className="form-control"
                        checked={isTwoSided}
                    />
                </label>
                <div>
                    <label htmlFor="zoom">Zoom (if you want to see details or big picture)</label>
                    <input
                        id="zoom"
                        type="number"
                        min="0.1"
                        step="0.1"
                        onChange={this.handleZoom}
                        className="form-control"
                        placeholder="zoom"
                        value={zoom}
                    />
                </div>
                <div>
                    <label htmlFor="zoom">Snapping distance in mm. 0 to disable.</label>
                    <input
                        id="zoom"
                        type="number"
                        min="0"
                        step="0.1"
                        onChange={this.handleSnappingDistance}
                        className="form-control"
                        placeholder="Snapping distance"
                        value={snappingDistance}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: State): StateProps => {
    return {
        width: state.cardset.width,
        height: state.cardset.height,
        isTwoSided: state.cardset.isTwoSided,
        snappingDistance: state.cardset.snappingDistance,
        zoom: state.cardset.zoom,
    };
};

export default connect<StateProps, DispatchProps, SidebarOwnProps, State>(mapStateToProps)(SidebarDetails);
