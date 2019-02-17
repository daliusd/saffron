import React, { Component } from 'react';

import KawaiiMessage, { Character } from './components/KawaiiMessage';

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

    componentDidCatch() {
        this.setState({ hasError: true });
        // You can also log the error to an error reporting service
        // logErrorToMyService(error, info);
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
