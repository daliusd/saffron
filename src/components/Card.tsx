import { connect } from 'react-redux';
import Measure from 'react-measure';
import React, { Component } from 'react';

import { BLEED_WIDTH } from '../constants';
import { CardType, IdsArray, FieldInfoCollection } from '../types';
import { Dispatch, cardSetActiveCardAndField } from '../actions';
import { State } from '../reducers';
import ImageField from './ImageField';
import TextField from './TextField';
import style from './Card.module.css';

interface OwnProps {
    card: CardType;
    isBack: boolean;
}

interface StateProps {
    cardFields: FieldInfoCollection;
    fieldsIds: IdsArray;
    width: number;
    height: number;
    isTwoSided: boolean;
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
        const { dispatch, card, isBack } = this.props;
        const el = event.target as HTMLElement;
        if (el.getAttribute('id') === `card_${card.id}`) {
            dispatch(cardSetActiveCardAndField(card.id, isBack, undefined));
            event.stopPropagation();
        }
    };

    render() {
        const { cardFields, fieldsIds, card, isBack, width, height, isActiveCard, zoom, isTwoSided } = this.props;
        const widthWithBleeds = width + BLEED_WIDTH * 2;
        const heightWithBleeds = height + BLEED_WIDTH * 2;

        const ppmm = this.state.dimensions.width / widthWithBleeds;

        return (
            <div>
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
                                width: `${widthWithBleeds * zoom}mm`,
                                height: `${heightWithBleeds * zoom}mm`,
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                            onMouseDown={this.handleFieldDeselect}
                            onTouchStart={this.handleFieldDeselect}
                        >
                            {fieldsIds.map(id => {
                                const p = cardFields[id];
                                if (p.type === 'image') {
                                    return (
                                        <ImageField
                                            key={p.id}
                                            cardId={card.id}
                                            isOnBack={isBack}
                                            imageFieldInfo={p}
                                            ppmm={ppmm}
                                            cardWidth={this.state.dimensions.width}
                                            cardHeight={this.state.dimensions.height}
                                        />
                                    );
                                } else if (p.type === 'text') {
                                    return (
                                        <TextField
                                            key={p.id}
                                            cardId={card.id}
                                            isOnBack={isBack}
                                            textFieldInfo={p}
                                            ppmm={ppmm}
                                            cardWidth={this.state.dimensions.width}
                                            cardHeight={this.state.dimensions.height}
                                        />
                                    );
                                }
                                return null;
                            })}

                            <div
                                style={{
                                    position: 'absolute',
                                    width: `${width * zoom}mm`,
                                    height: `${height * zoom}mm`,
                                    left: `${BLEED_WIDTH * zoom}mm`,
                                    top: `${BLEED_WIDTH * zoom}mm`,
                                    border: '1px dashed black',
                                    borderRadius: '5mm',
                                    pointerEvents: 'none',
                                }}
                            />

                            <div
                                style={{
                                    position: 'absolute',
                                    width: `${(width - BLEED_WIDTH * 2) * zoom}mm`,
                                    height: `${(height - BLEED_WIDTH * 2) * zoom}mm`,
                                    left: `${BLEED_WIDTH * 2 * zoom}mm`,
                                    top: `${BLEED_WIDTH * 2 * zoom}mm`,
                                    border: '1px dashed red',
                                    borderRadius: '5mm',
                                    pointerEvents: 'none',
                                }}
                            />
                        </div>
                    )}
                </Measure>
                {isTwoSided && (
                    <div
                        className={style.title}
                        style={{
                            width: `${widthWithBleeds * zoom}mm`,
                            position: 'relative',
                        }}
                    >
                        {isBack ? 'Back' : 'Front'}
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = (state: State, props: OwnProps): StateProps => {
    let cardFields = state.cardset.present.fields[props.card.id];

    return {
        cardFields,
        fieldsIds: state.cardset.present.fieldsAllIds.filter(id => (cardFields[id].isOnBack || false) === props.isBack),
        width: state.cardset.present.width,
        height: state.cardset.present.height,
        isTwoSided: state.cardset.present.isTwoSided,
        isActiveCard:
            state.cardset.present.activeCardId === props.card.id && state.cardset.present.isBackActive === props.isBack,
        zoom: state.cardset.present.zoom,
    };
};

export default connect<StateProps, DispatchProps, OwnProps, State>(mapStateToProps)(Card);
