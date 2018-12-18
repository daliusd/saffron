// @flow
import React, { type ElementRef, PureComponent } from 'react';

type Props = {
    content: string,
    contentId: string,
    onFocus: (editDiv: ElementRef<any>) => void,
    onBlur: (content: string) => void,
    onKeyUp: (editDiv: ElementRef<any>) => void,
    onChange: (content: string) => void,
};

type State = {
    content: string,
    contentId: string,
};

export default class ContentEditable extends PureComponent<Props, State> {
    editDiv: ElementRef<any>;

    constructor(props: Props) {
        super();
        this.editDiv = React.createRef();
        this.state = {
            content: props.content,
            contentId: props.contentId,
        };
    }

    makeEditable = () => {
        this.editDiv.current.contentEditable = 'true';
        this.editDiv.current.focus();
    };

    onFocus = () => {
        this.props.onFocus(this.editDiv);
    };

    onBlur = () => {
        this.props.onBlur(this.editDiv.current.innerText);
    };

    onKeyUp = () => {
        this.props.onKeyUp(this.editDiv);
    };

    onInput = () => {
        const content = this.editDiv.current.innerText;
        this.setState({ content });
        this.props.onChange(content);
    };

    render() {
        return (
            <div
                ref={this.editDiv}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                onKeyUp={this.onKeyUp}
                onInput={this.onInput}
                style={{
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                }}
            >
                {this.state.content}
            </div>
        );
    }
}
