// @flow
import React, { Component } from 'react';
import type { GameType } from '../reducers';

type Props = {
    onGameCreate: (gamename: string) => void,
    isAuthenticated: boolean,
    gamelist: Array<GameType>,
};

export default class Games extends Component<Props> {
    handleCreateGameClick(event: SyntheticEvent<>) {
        const gamename = this.refs.gamename;
        this.props.onGameCreate(gamename.value.trim());
    }

    render() {
        const { isAuthenticated, gamelist } = this.props;

        const gameItems = gamelist.map(game => <li key={game.id.toString()}>{game.name}</li>);

        return (
            isAuthenticated && (
                <div>
                    <div>
                        <input type="text" ref="gamename" className="form-control" placeholder="Game name" />
                        <button onClick={event => this.handleCreateGameClick(event)}>Create Game</button>
                    </div>
                    <ul>{gameItems}</ul>
                </div>
            )
        );
    }
}
