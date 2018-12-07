// @flow
import React, { Component } from 'react';

import CardSets from './components/CardSets';
import Games from './components/Games';

type Props = {};

export default class Main extends Component<Props> {
    render() {
        return (
            <div className="App">
                <div className="container">
                    <Games />
                    <CardSets />
                </div>
            </div>
        );
    }
}
