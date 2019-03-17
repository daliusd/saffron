import React, { Component } from 'react';
import style from './ConfirmedDelete.module.css';

interface Props {
    question: string;
    onDelete: () => void;
}

export default class ConfirmedDelete extends Component<Props> {
    state = {
        deleteClicked: false,
    };

    handleRemove = () => {
        this.setState({ deleteClicked: !this.state.deleteClicked });
    };

    handleYes = () => {
        this.setState({ deleteClicked: false });
        this.props.onDelete();
    };

    handleNo = () => {
        this.setState({ deleteClicked: false });
    };

    render() {
        const { deleteClicked } = this.state;
        const { question } = this.props;

        return (
            <>
                <i title="Remove" className={`material-icons ${style.button}`} onClick={this.handleRemove}>
                    remove_circle_outline
                </i>{' '}
                {deleteClicked && (
                    <>
                        {question}{' '}
                        <span className={style.answer} onClick={this.handleYes}>
                            Yes
                        </span>{' '}
                        /{' '}
                        <span className={style.answer} onClick={this.handleNo}>
                            No
                        </span>
                    </>
                )}
            </>
        );
    }
}
