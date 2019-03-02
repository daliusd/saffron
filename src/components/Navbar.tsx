import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import React, { Component } from 'react';

import { CardSetType, Dispatch, GameType, MessageType, logoutRequest } from '../actions';
import { State } from '../reducers';
import { getActiveCardSet, getActiveGame } from '../selectors';
import Loader from './Loader';
import Logout from './Logout';
import style from './Navbar.module.css';

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
                <div id="messages" className={style.messages}>
                    <ul>
                        {messages.map(m => (
                            <li key={m.id} className={m.type === 'error' ? style.error : style.info}>
                                {m.type === 'error' && (
                                    <>
                                        <i className="material-icons">error</i> {m.text}
                                    </>
                                )}
                                {m.type === 'info' && (
                                    <>
                                        <i className="material-icons">info</i> {m.text}
                                    </>
                                )}
                                {m.type === 'progress' && (
                                    <>
                                        <Loader small={true} /> {m.text}
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
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
                                </>
                            )}
                            <li>
                                <Link to="/changelog">Changelog</Link>
                            </li>
                            <li>
                                <Link to="/about">About</Link>
                            </li>
                            {isAuthenticated && (
                                <li>
                                    <Logout onLogout={() => dispatch(logoutRequest())} />
                                </li>
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
