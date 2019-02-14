import style from './Navbar.module.css';
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
            <nav>
                <div>
                    <h1 className={style.header}>
                        <Link to="/">CARD-A-MON</Link>
                    </h1>
                    <div>
                        <ul className={style.menu}>
                            {isAuthenticated && (
                                <>
                                    <li>
                                        <Link to="/">Main</Link>
                                    </li>
                                    {activeGame && (
                                        <li>
                                            <Link to={`/game/${activeGame.id}`}>Game "{activeGame.name}"</Link>
                                        </li>
                                    )}
                                    {activeCardSet && (
                                        <li>
                                            <Link to={`/cardset/${activeCardSet.id}`}>
                                                Card Set "{activeCardSet.name}"
                                            </Link>
                                        </li>
                                    )}
                                    <li>
                                        <Logout onLogout={() => dispatch(logoutRequest())} />
                                    </li>
                                </>
                            )}
                            {!isAuthenticated && (
                                <>
                                    <li>
                                        <Link to="/login">Login</Link>
                                    </li>
                                    <li>
                                        <Link to="/signup">Sign-up</Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>

                    <div id="messages">
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
