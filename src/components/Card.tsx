import { connect } from 'react-redux';
import Measure from 'react-measure';
import React, { Component } from 'react';

import { CardType, Dispatch, PlaceholdersCollection, cardSetActiveCardAndPlaceholder } from '../actions';
import { State } from '../reducers';
import ImageField from './ImageField';
import TextField from './TextField';
import style from './Card.module.css';

interface OwnProps {
    card: CardType;
}

interface StateProps {
    placeholders: PlaceholdersCollection;
    width: number;
    height: number;
    isActiveCard: boolean;
    zoom: number;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & StateProps & DispatchProps;

interface LocalState {
    dimensions: {
        width: number;
        height: number;
    };
}

class Card extends Component<Props, LocalState> {
    state = {
        dimensions: {
            width: -1,
            height: -1,
        },
    };

    handleFieldDeselect = (event: React.MouseEvent | React.TouchEvent) => {
        const { dispatch, card } = this.props;
        const el = event.target as HTMLElement;
        if (el.getAttribute('id') === `card_${card.id}`) {
            dispatch(cardSetActiveCardAndPlaceholder(card.id, null));
            event.stopPropagation();
        }
    };

    render() {
        const { placeholders, card, width, height, isActiveCard, zoom } = this.props;
        const ppmm = this.state.dimensions.width / width;

        return (
            <Measure
                client
                onResize={contentRect => {
                    if (!contentRect.client) {
                        return;
                    }
                    this.setState({ dimensions: contentRect.client });
                }}
            >
                {({ measureRef }) => (
                    <div
                        className={`${style.card} ${isActiveCard ? style.active : ''}`}
                        id={`card_${card.id}`}
                        ref={measureRef}
                        style={{
                            width: `${width * zoom}mm`,
                            height: `${height * zoom}mm`,
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                        onMouseDown={this.handleFieldDeselect}
                        onTouchStart={this.handleFieldDeselect}
                    >
                        {Object.values(placeholders).map(p => {
                            if (p.type === 'image') {
                                return <ImageField key={p.id} cardId={card.id} imagePlaceholder={p} ppmm={ppmm} />;
                            } else if (p.type === 'text') {
                                return <TextField key={p.id} cardId={card.id} textPlaceholder={p} ppmm={ppmm} />;
                            }
                            return null;
                        })}
                    </div>
                )}
            </Measure>
        );
    }
}

const mapStateToProps = (state: State, props: OwnProps): StateProps => {
    return {
        placeholders: state.cardsets.placeholders,
        width: state.cardsets.width,
        height: state.cardsets.height,
        isActiveCard: state.cardsets.activeCard === props.card.id,
        zoom: state.cardsets.zoom,
    };
};

export default connect<StateProps, DispatchProps, OwnProps, State>(mapStateToProps)(Card);
