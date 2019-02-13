import React, { Component } from 'react';

import KawaiiMessage, { Character } from './components/KawaiiMessage';

export default class NotFoundPage extends Component {
    render() {
        return (
            <KawaiiMessage character={Character.Browser} mood="sad">
                There is nothing here.
            </KawaiiMessage>
        );
    }
}
