import { connect } from 'react-redux';
import React, { Component } from 'react';

import { Dispatch, gameSelectRequest } from './actions';
import CardSets from './components/CardSets';

interface Props {
    dispatch: Dispatch;
    match: { params: { id: string } };
}

export class GamePage extends Component<Props> {
    componentDidMount() {
        const { dispatch, match } = this.props;
        dispatch(gameSelectRequest(match.params.id, true));
    }

    render() {
        return <CardSets />;
    }
}

export default connect()(GamePage);
