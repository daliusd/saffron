// @flow
import { Ghost } from 'react-kawaii';
import { connect } from 'react-redux';
import React, { Component } from 'react';

import { State } from './reducers';
import Games from './components/Games';

interface Props {
    isAuthenticated: boolean;
}

export class Main extends Component<Props> {
    render() {
        if (this.props.isAuthenticated) {
            return <Games />;
        } else {
            return (
                <div>
                    <Ghost size={120} mood="blissful" color="#E0E4E8" />
                    Hey! Here you can create your own card game but you need to <a href="/login">Login</a> or{' '}
                    <a href="/signup">Sign-up</a> first.
                </div>
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
