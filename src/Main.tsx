import { connect } from 'react-redux';
import React, { Component } from 'react';

import { State } from './reducers';
import Games from './components/Games';
import KawaiiMessage, { Character } from './components/KawaiiMessage';
import FeatureList from './components/FeatureList';

interface Props {
    isAuthenticated?: boolean;
}

export class Main extends Component<Props> {
    render() {
        if (this.props.isAuthenticated) {
            return <Games />;
        } else {
            return (
                <KawaiiMessage character={Character.Ghost}>
                    <FeatureList />
                    Here you can create your own card game but you need to <a href="/login">Login</a> or{' '}
                    <a href="/signup">Sign-up</a> first.
                </KawaiiMessage>
            );
        }
    }
}

const mapStateToProps = (state: State) => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
    };
};

export default connect(mapStateToProps)(Main);
