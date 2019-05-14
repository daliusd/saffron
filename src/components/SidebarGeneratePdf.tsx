import { connect } from 'react-redux';
import React, { Component } from 'react';

import { DispatchProps, SidebarOwnProps } from '../types';
import { State } from '../reducers';
import PDFGenerator from './PDFGenerator';
import style from './SidebarGeneratePdf.module.css';

interface StateProps {
    activeCardSetId: string | null;
}

type Props = StateProps & DispatchProps & SidebarOwnProps;

export class SidebarGeneratePdf extends Component<Props> {
    render() {
        const { activeCardSetId, visible } = this.props;

        return (
            <div className={style.view} style={{ display: visible ? 'grid' : 'none' }}>
                {activeCardSetId !== null && <PDFGenerator type="cardsets" id={activeCardSetId} />}
            </div>
        );
    }
}

const mapStateToProps = (state: State): StateProps => {
    return {
        activeCardSetId: state.cardsets.active,
    };
};

export default connect<StateProps, DispatchProps, SidebarOwnProps, State>(mapStateToProps)(SidebarGeneratePdf);
