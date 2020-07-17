import React, { Component } from 'react';

import KawaiiMessage, { Character } from './components/KawaiiMessage';
import { reportError } from './utils';

window.addEventListener('error', function(evt: ErrorEvent) {
    const error = evt.error;
    reportError(error);
});

window.addEventListener('unhandledrejection', function (event: PromiseRejectionEvent) {
    reportError(new Error(event.reason));
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

    componentDidCatch(error: Error | null) {
        this.setState({ hasError: true });
        if (error !== null) {
            reportError(error);
        }
    }

    render() {
        if (this.state.hasError) {
            return (
                <KawaiiMessage character={Character.Browser} mood="ko">
                    Something unexpected has happened. Error report is sent to me by e-mail and I will review it as soon
                    as possible. Still feel free to contact me by e-mail{' '}
                    <a href="mailto:dalius@ffff.lt">dalius@ffff.lt</a>.
                </KawaiiMessage>
            );
        }
        return this.props.children;
    }
}
