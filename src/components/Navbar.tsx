import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import React, { Component } from 'react';

import { CardSetType, Dispatch, GameType, MessageType, logoutRequest } from '../actions';
import { State } from '../reducers';
import { getActiveCardSet, getActiveGame } from '../selectors';
import Logout from './Logout';

interface OwnProps {
    isAuthenticated: boolean;
}

interface StateProps {
    messages: MessageType[];
    activeGame: GameType | null;
    activeCardSet: CardSetType | null;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & StateProps & DispatchProps;

export class Navbar extends Component<Props> {
    render() {
        const { dispatch, isAuthenticated, messages, activeGame, activeCardSet } = this.props;

        return (
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <h1>
                        <Link to="/">Cardamon</Link>
                    </h1>
                    <div>{isAuthenticated && <Logout onLogout={() => dispatch(logoutRequest())} />}</div>
                    <div>{isAuthenticated && <Link to="/">Main</Link>}</div>
                    <div>
                        {isAuthenticated && activeGame && <Link to={`/game/${activeGame.id}`}>{activeGame.name}</Link>}
                    </div>
                    <div>
                        {isAuthenticated && activeCardSet && (
                            <Link to={`/cardset/${activeCardSet.id}`}>{activeCardSet.name}</Link>
                        )}
                    </div>

                    <div>{!isAuthenticated && <Link to="/login">Login</Link>}</div>
                    <div>{!isAuthenticated && <Link to="/signup">Sign-up</Link>}</div>

                    <div>
                        <ul>
                            {messages.map(m => (
                                <li key={m.id}>{m.text}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

const mapStateToProps = (state: State) => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        messages: state.message.messages,
        activeGame: getActiveGame(state),
        activeCardSet: getActiveCardSet(state),
    };
};

export default connect<StateProps, DispatchProps, OwnProps, State>(mapStateToProps)(Navbar);
