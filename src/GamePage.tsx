import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import React, { Component } from 'react';

import { Dispatch, gameSelectRequest } from './actions';
import { State } from './reducers';

interface Props {
    dispatch: Dispatch;
    match: { params: { id: string } };
    isAuthenticated: boolean;
}

export class GamePage extends Component<Props> {
    componentDidMount() {
        const { dispatch, match } = this.props;
        dispatch(gameSelectRequest(match.params.id, true));
    }

    render() {
        return <Redirect to="/login" />;
    }
}

const mapStateToProps = (state: State) => ({ isAuthenticated: state.auth.isAuthenticated });

export default connect(mapStateToProps)(GamePage);
