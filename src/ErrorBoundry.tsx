import React, { Component } from 'react';

import KawaiiMessage, { Character } from './components/KawaiiMessage';
import { reportError } from './utils';

window.addEventListener('error', function(evt: ErrorEvent) {
    if (process.env.NODE_ENV === 'production') {
        let error = evt.error;
        reportError(`${error.message} ${error.stack}`);
    }
});

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error: Error | null, info: object) {
        this.setState({ hasError: true });
        if (process.env.NODE_ENV === 'production') {
            if (error !== null) {
                reportError(`${error.message} ${error.stack}`);
            } else {
                reportError(`No error: ${info}`);
            }
        }
    }

    render() {
        if (this.state.hasError) {
            return (
                <KawaiiMessage character={Character.Browser} mood="ko">
                    Something unexpected has happened. If you want this problem to be fixed write me to{' '}
                    <a href="mailto:dalius@ffff.lt">dalius@ffff.lt</a>.
                </KawaiiMessage>
            );
        }
        return this.props.children;
    }
}
