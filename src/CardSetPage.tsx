import { connect } from 'react-redux';
import React, { Component } from 'react';

import { Dispatch, cardSetSelectRequest } from './actions';
import { State } from './reducers';
import CardSet from './components/CardSet';

interface Props {
    dispatch: Dispatch;
    match: { params: { id: string } };
    isAuthenticated: boolean;
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

const mapStateToProps = (state: State) => ({ isAuthenticated: state.auth.isAuthenticated });

export default connect(mapStateToProps)(CardSetPage);
