/** @jsx jsx */
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { jsx } from '@emotion/core';
import { Component } from 'react';

import { CardSetType, Dispatch, GameType, MessageType, logoutRequest } from '../actions';
import { State } from '../reducers';
import { getActiveCardSet, getActiveGame } from '../selectors';
import Logout from './Logout';

jsx; // eslint-disable-line

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
                    <h1
                        css={{
                            fontFamily: 'Monoton',
                            fontWeight: 400,
                            fontSize: '2.5em',
                            lineHeight: 1.5,
                            margin: 0,
                            a: {
                                textDecoration: 'none',
                                outline: 0,
                                color: 'black',
                            },
                        }}
                    >
                        <Link to="/">CARD-A-MON</Link>
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
