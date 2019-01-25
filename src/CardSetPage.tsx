import { connect } from 'react-redux';
import React, { Component } from 'react';

import { Dispatch, cardSetSelectRequest } from './actions';
import CardSet from './components/CardSet';

interface Props {
    dispatch: Dispatch;
    match: { params: { id: string } };
}

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
