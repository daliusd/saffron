import React, { Component } from 'react';
import style from './EditableTitle.module.css';

interface Props {
    title: string;
    onChange: (newName: string) => void;
}

export default class EditableTitle extends Component<Props> {
    state = {
        titleIsEdited: false,
    };

    handleClick = () => {
        this.setState({ titleIsEdited: true });
    };

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.onChange(event.target.value);
    };

    handleBlur = () => {
        this.setState({ titleIsEdited: false });
    };

    render() {
        const { titleIsEdited } = this.state;
        const { title } = this.props;

        return (
            <>
                {!titleIsEdited && (
                    <h1 className={style.input} onClick={this.handleClick}>
                        {title}
                    </h1>
                )}
                {titleIsEdited && (
                    <input
                        autoFocus
                        type="text"
                        className={style.input}
                        value={title}
                        onChange={this.handleChange}
                        onBlur={this.handleBlur}
                    />
                )}
            </>
        );
    }
}
