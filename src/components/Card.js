// @flow
import Measure from 'react-measure';
import React, { Component } from 'react';

type Props = {};

type State = {
    dimensions: {
        width: number,
        height: number,
    },
};

export default class Card extends Component<Props, State> {
    state = {
        dimensions: {
            width: -1,
            height: -1,
        },
    };

    render() {
        const { width } = this.state.dimensions;
        console.log(width);

        return (
            <Measure
                client
                onResize={contentRect => {
                    console.log(contentRect);
                    this.setState({ dimensions: contentRect.client });
                }}
            >
                {({ measureRef }) => (
                    <div
                        ref={measureRef}
                        style={{ width: '5cm', height: `${width * 1.5}px`, border: '1px solid black' }}
                    >
                        Card here
                    </div>
                )}
            </Measure>
        );
    }
}
