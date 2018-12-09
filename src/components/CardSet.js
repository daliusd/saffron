// @flow
import { connect } from 'react-redux';
import React, { Component } from 'react';

import { type CardSetType, type Dispatch, cardCreateRequest } from '../actions';
import { getActiveCardSet } from '../selectors';
import Card from './Card';

type Props = {
    dispatch: Dispatch,
    isAuthenticated: boolean,
    activeCardSet: CardSetType,
};

export class CardSet extends Component<Props> {
    handleCreateCardClick(event: SyntheticEvent<>) {
        const { dispatch, activeCardSet } = this.props;

        dispatch(cardCreateRequest(activeCardSet.id));
    }

    render() {
        const { isAuthenticated, activeCardSet } = this.props;

        return (
            isAuthenticated &&
            activeCardSet && (
                <div>
                    <div>CardSet placeholder</div>
                    <div>
                        <ul>
                            {activeCardSet.data &&
                                activeCardSet.data.cards &&
                                activeCardSet.data.cards.map((card, index) => (
                                    <li key={index}>
                                        <Card />
                                    </li>
                                ))}
                        </ul>
                    </div>
                    <div>
                        <button onClick={event => this.handleCreateCardClick(event)}>Create Card</button>
                    </div>
                </div>
            )
        );
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        activeCardSet: getActiveCardSet(state),
    };
};

export default connect(mapStateToProps)(CardSet);
