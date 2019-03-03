import { connect, ConnectedComponentClass } from 'react-redux';
import React, { Component } from 'react';

import { DispatchProps, SidebarOwnProps } from '../types';
import { SidebarState, cardSetSetSidebarState } from '../actions';
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

type Props = StateProps & DispatchProps;

interface SidebarInfo {
    state: SidebarState;
    title: string;
    icon: string;
    component: ConnectedComponentClass<typeof Component, SidebarOwnProps>;
}

const SIDEBARS: SidebarInfo[] = [
    {
        state: SidebarState.Details,
        title: 'Details',
        icon: 'details',
        component: SidebarDetails,
    },
    {
        state: SidebarState.Image,
        title: 'Images',
        icon: 'photo',
        component: SidebarImage,
    },
    {
        state: SidebarState.Text,
        title: 'Texts',
        icon: 'text_fields',
        component: SidebarText,
    },
    {
        state: SidebarState.Upload,
        title: 'Upload',
        icon: 'cloud_upload',
        component: SidebarUpload,
    },
    // picture_as_pdf
];

export class Sidebar extends Component<Props> {
    handleSidebar = (state: SidebarState) => {
        const { activeSidebar, dispatch } = this.props;
        if (activeSidebar === state) {
            dispatch(cardSetSetSidebarState(null));
        } else {
            dispatch(cardSetSetSidebarState(state));
        }
    };

    render() {
        const { activeSidebar } = this.props;
        return (
            <div className={style.sidebar}>
                <div className={style.controls}>
                    {SIDEBARS.map(sb => (
                        <i
                            key={sb.state}
                            title={sb.title}
                            className={`material-icons ${activeSidebar === sb.state ? style.active : ''}`}
                            onClick={() => this.handleSidebar(sb.state)}
                        >
                            {sb.icon}
                        </i>
                    ))}
                </div>
                <div className={`${style.view} ${activeSidebar === null ? style.hidden : ''}`}>
                    {SIDEBARS.map(sb => (
                        <sb.component visible={activeSidebar === sb.state} />
                    ))}
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
