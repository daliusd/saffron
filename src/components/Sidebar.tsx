import { connect } from 'react-redux';
import React, { Component } from 'react';

import { Dispatch, SidebarState, cardSetSetSidebarState } from '../actions';
import { State } from '../reducers';
import SidebarDetails from './SidebarDetails';
import SidebarImage from './SidebarImage';
import SidebarText from './SidebarText';
import SidebarUpload from './SidebarUpload';
import style from './Sidebar.module.css';

interface StateProps {
    isAuthenticated: boolean;
    activeSidebar: SidebarState | null;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = StateProps & DispatchProps;

export class Sidebar extends Component<Props> {
    handleDetails = () => {
        const { activeSidebar, dispatch } = this.props;
        if (activeSidebar === SidebarState.Details) {
            dispatch(cardSetSetSidebarState(null));
        } else {
            dispatch(cardSetSetSidebarState(SidebarState.Details));
        }
    };

    handleImages = () => {
        const { activeSidebar, dispatch } = this.props;
        if (activeSidebar === SidebarState.Image) {
            dispatch(cardSetSetSidebarState(null));
        } else {
            dispatch(cardSetSetSidebarState(SidebarState.Image));
        }
    };

    handleTexts = () => {
        const { activeSidebar, dispatch } = this.props;
        if (activeSidebar === SidebarState.Text) {
            dispatch(cardSetSetSidebarState(null));
        } else {
            dispatch(cardSetSetSidebarState(SidebarState.Text));
        }
    };

    handleUpload = () => {
        const { activeSidebar, dispatch } = this.props;
        if (activeSidebar === SidebarState.Upload) {
            dispatch(cardSetSetSidebarState(null));
        } else {
            dispatch(cardSetSetSidebarState(SidebarState.Upload));
        }
    };

    render() {
        const { activeSidebar } = this.props;
        return (
            <div className={style.sidebar}>
                <div className={style.controls}>
                    <i
                        title="Details"
                        className={`material-icons ${activeSidebar === SidebarState.Details ? style.active : ''}`}
                        onClick={this.handleDetails}
                    >
                        details
                    </i>
                    <i
                        title="Images"
                        className={`material-icons ${activeSidebar === SidebarState.Image ? style.active : ''}`}
                        onClick={this.handleImages}
                    >
                        photo
                    </i>
                    <i
                        title="Texts"
                        className={`material-icons ${activeSidebar === SidebarState.Text ? style.active : ''}`}
                        onClick={this.handleTexts}
                    >
                        text_fields
                    </i>
                    <i
                        title="Upload"
                        className={`material-icons ${activeSidebar === SidebarState.Upload ? style.active : ''}`}
                        onClick={this.handleUpload}
                    >
                        cloud_upload
                    </i>
                    {/*<i className="material-icons">picture_as_pdf</i>*/}
                </div>
                <div className={`${style.view} ${activeSidebar === null ? style.hidden : ''}`}>
                    <SidebarDetails visible={activeSidebar === SidebarState.Details} />
                    <SidebarImage visible={activeSidebar === SidebarState.Image} />
                    <SidebarText visible={activeSidebar === SidebarState.Text} />
                    <SidebarUpload visible={activeSidebar === SidebarState.Upload} />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: State): StateProps => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        activeSidebar: state.cardsets.activeSidebar,
    };
};

export default connect<StateProps, DispatchProps, {}, State>(mapStateToProps)(Sidebar);
