import { Redirect } from 'react-router-dom';
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
        const { dispatch, match, isAuthenticated } = this.props;
        if (isAuthenticated) {
            dispatch(cardSetSelectRequest(match.params.id));
        }
    }

    render() {
        if (this.props.isAuthenticated) {
            return <CardSet />;
        } else {
            return <Redirect to="/login" />;
        }
    }
}

const mapStateToProps = (state: State) => ({ isAuthenticated: state.auth.isAuthenticated });

export default connect(mapStateToProps)(CardSetPage);
