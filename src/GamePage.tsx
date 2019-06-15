import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import { Dispatch, gameSelectRequest } from './actions';
import { State } from './reducers';
import CardSets from './components/CardSets';

interface Props {
    dispatch: Dispatch;
    match: { params: { id: string } };
    isAuthenticated?: boolean;
}

export class GamePage extends Component<Props> {
    componentDidMount() {
        const { dispatch, match } = this.props;
        dispatch(gameSelectRequest(match.params.id, true));
    }

    render() {
        const { isAuthenticated } = this.props;
        if (isAuthenticated) {
            return <CardSets />;
        } else if (isAuthenticated === false) {
            return <Redirect to="/login" />;
        } else {
            return null;
        }
    }
}

const mapStateToProps = (state: State) => ({ isAuthenticated: state.auth.isAuthenticated });

export default connect(mapStateToProps)(GamePage);
