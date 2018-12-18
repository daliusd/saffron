// @flow
import { connect } from 'react-redux';
import Measure from 'react-measure';
import React, { Component } from 'react';

import {
    type CardTemplateType,
    type CardType,
    type Dispatch,
    type TextTemplatesCollection,
    cardSetAddTemplateText,
    cardSetCloneCard,
    cardSetRemoveCard,
    cardSetUpdateCardCount,
} from '../actions';
import TextField from './TextField';

type Props = {
    card: CardType,
    dispatch: Dispatch,
    template: CardTemplateType,
};

type State = {
    dimensions: {
        width: number,
        height: number,
    },
};

class Card extends Component<Props, State> {
    state = {
        dimensions: {
            width: -1,
            height: -1,
        },
    };

    handleRemoveCardClick = (event: SyntheticEvent<>) => {
        const { card, dispatch } = this.props;
        dispatch(cardSetRemoveCard(card));
    };

    handleCloneCardClick = (event: SyntheticEvent<>) => {
        const { card, dispatch } = this.props;
        dispatch(cardSetCloneCard(card));
    };

    handleCountChange = (event: SyntheticInputEvent<>) => {
        const { card, dispatch } = this.props;
        dispatch(cardSetUpdateCardCount(card, parseInt(event.target.value)));
    };

    handleAddTextClick = () => {
        const { dispatch } = this.props;
        dispatch(cardSetAddTemplateText());
    };

    render() {
        console.log('Card render');
        const { template, card } = this.props;
        const { width } = this.state.dimensions;
        const text_ids: Array<string> = Object.keys(template.texts);
        const texts: TextTemplatesCollection = template.texts;

        return (
            <Measure
                client
                onResize={contentRect => {
                    console.log(contentRect);
                    this.setState({ dimensions: contentRect.client });
                }}
            >
                {({ measureRef }) => (
                    <div>
                        <div
                            ref={measureRef}
                            style={{
                                width: '5cm',
                                height: `${width * 1.5}px`,
                                border: '1px solid black',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            {text_ids && text_ids.map(t => <TextField key={t} card={card} textTemplate={texts[t]} />)}
                        </div>

                        <button onClick={this.handleRemoveCardClick}>Remove</button>
                        <button onClick={this.handleCloneCardClick}>Clone</button>
                        <input type="number" value={card.count.toString()} onChange={this.handleCountChange} />
                        <button onClick={this.handleAddTextClick}>Text</button>
                    </div>
                )}
            </Measure>
        );
    }
}

const mapStateToProps = state => {
    return {
        template: state.cardsets.template,
    };
};

export default connect(mapStateToProps)(Card);
