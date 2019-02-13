import { Ghost, Browser } from 'react-kawaii';
import React, { Component } from 'react';

export enum Character {
    Ghost,
    Browser,
}
interface Props {
    character: Character;
    mood?: string;
}

export default class KawaiiMessage extends Component<Props> {
    render() {
        const { character, mood } = this.props;

        return (
            <div
                style={{
                    padding: '1em',
                    borderRadius: '1em',
                    backgroundColor: '#ebf3fa',
                    display: 'grid',
                    grid: 'auto-flow / minmax(120px, auto) 1fr',
                }}
            >
                {character === Character.Ghost && <Ghost size={120} mood={mood || 'blissful'} color="#faebef" />}
                {character === Character.Browser && <Browser size={120} mood={mood || 'blissful'} color="#faebef" />}
                <div style={{ marginLeft: '1em' }}>{this.props.children}</div>
            </div>
        );
    }
}
