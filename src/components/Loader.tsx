import React, { Component } from 'react';

import style from './Loader.module.css';

interface Props {
    fixed?: boolean;
    small?: boolean;
}

export default class Loader extends Component<Props> {
    render() {
        const { fixed, small } = this.props;

        return (
            <div className={`${style.loader} ${fixed ? style.fixed : style.relative} ${small ? style.small : ''}`}>
                <div />
                <div />
            </div>
        );
    }
}
