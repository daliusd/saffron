import React, { Component } from 'react';

import style from './Loader.module.css';

interface Props {
    fixed?: boolean;
}

export default class Loader extends Component<Props> {
    render() {
        const { fixed } = this.props;

        return (
            <div className={`${style.loader} ${fixed ? style.fixed : style.relative}`}>
                <div />
                <div />
            </div>
        );
    }
}
