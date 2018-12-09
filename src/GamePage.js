// @flow
import { connect } from 'react-redux';
import React, { Component } from 'react';

import { type Dispatch, gameSelectRequest } from './actions';
import CardSets from './components/CardSets';

type Props = {
    dispatch: Dispatch,
    match: Object,
};

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
