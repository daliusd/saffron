import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import React, { Component } from 'react';

import { Dispatch, gameSelectRequest } from './actions';
import { State } from './reducers';
import CardSets from './components/CardSets';

interface Props {
    dispatch: Dispatch;
    match: { params: { id: string } };
    isAuthenticated: boolean;
}

export class GamePage extends Component<Props> {
    componentDidMount() {
        const { dispatch, match, isAuthenticated } = this.props;
        if (isAuthenticated) {
            dispatch(gameSelectRequest(match.params.id, true));
        }
    }

    render() {
        if (this.props.isAuthenticated) {
            return <CardSets />;
        } else {
            return <Redirect to="/login" />;
        }
    }
}

const mapStateToProps = (state: State) => ({ isAuthenticated: state.auth.isAuthenticated });

export default connect(mapStateToProps)(GamePage);
