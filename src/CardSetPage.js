// @flow
import { connect } from 'react-redux';
import React, { Component } from 'react';

import { type Dispatch, cardSetSelectRequest } from './actions';
import CardSet from './components/CardSet';

type Props = {
    dispatch: Dispatch,
    match: Object,
};

export class CardSetPage extends Component<Props> {
    componentDidMount() {
        const { dispatch, match } = this.props;
        dispatch(cardSetSelectRequest(match.params.id));
    }

    render() {
        return <CardSet />;
    }
}

export default connect()(CardSetPage);
