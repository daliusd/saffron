// @flow
import { connect } from 'react-redux';
import React, { Component } from 'react';
import Select from 'react-select';
import WebFont from 'webfontloader';

import { DEFAULT_FONT, DEFAULT_FONT_SIZE, DEFAULT_FONT_VARIANT } from '../fontLoader';
import {
    type Dispatch,
    cardSetChangeActiveTextPlaceholderFontFamilyAndVariant,
    cardSetChangeActiveTextPlaceholderFontSize,
    cardSetChangeActiveTextPlaceholderFontVariant,
} from '../actions';
import webfonts from './webfonts';

const options = Object.keys(webfonts)
    .sort()
    .map(fi => ({ value: fi, label: fi }));

type FontOption = { value: string, label: string };

type Props = {
    dispatch: Dispatch,
    activeFont: string,
    activeFontVariant: string,
    activeFontSize: string,
};

class FontSelector extends Component<Props> {
    getFontStringForLoad = (family, variant) => {
        let stringForLoad = family;
        if (variant !== 'regular') {
            stringForLoad += ':' + variant;
        }
        return stringForLoad;
    };

    handleChange = (selectedOption: FontOption) => {
        const fontFamily = selectedOption.value;

        let fontVariant = this.props.activeFontVariant;
        if (!(fontVariant in webfonts[fontFamily])) {
            fontVariant = Object.keys(webfonts[fontFamily]).sort()[0];
        }

        WebFont.load({
            google: {
                families: [this.getFontStringForLoad(fontFamily, fontVariant)],
            },
            active: () => {
                const { dispatch } = this.props;
                dispatch(cardSetChangeActiveTextPlaceholderFontFamilyAndVariant(fontFamily, fontVariant));
            },
        });
    };

    handleFontVariantChange = (selectedOption: FontOption) => {
        WebFont.load({
            google: {
                families: [this.getFontStringForLoad(this.props.activeFont, selectedOption.value)],
            },
            active: () => {
                const { dispatch } = this.props;
                dispatch(cardSetChangeActiveTextPlaceholderFontVariant(selectedOption.value));
            },
        });
    };

    handleFontSizeChange = (event: SyntheticInputEvent<>) => {
        const { dispatch } = this.props;
        dispatch(cardSetChangeActiveTextPlaceholderFontSize(event.target.value));
    };

    render() {
        const selectedFontFamily = options.find(f => f.value === this.props.activeFont);

        const fontVariantOptions = Object.keys(webfonts[this.props.activeFont])
            .sort()
            .map(fv => ({ value: fv, label: fv }));

        const selectedFontVariant = fontVariantOptions.find(f => f.value === this.props.activeFontVariant);

        return (
            <div>
                <div style={{ width: 200, display: 'inline-block' }}>
                    <Select value={selectedFontFamily} onChange={this.handleChange} options={options} />
                </div>
                <div style={{ width: 100, display: 'inline-block' }}>
                    <Select
                        value={selectedFontVariant}
                        onChange={this.handleFontVariantChange}
                        options={fontVariantOptions}
                    />
                </div>
                <div style={{ width: 20, display: 'inline-block' }}>
                    <input type="number" value={this.props.activeFontSize} onChange={this.handleFontSizeChange} />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, props) => {
    const activeFont =
        state.cardsets.placeholders && state.cardsets.activePlaceholder
            ? state.cardsets.placeholders[state.cardsets.activePlaceholder].fontFamily || DEFAULT_FONT
            : DEFAULT_FONT;
    const activeFontVariant =
        state.cardsets.placeholders && state.cardsets.activePlaceholder
            ? state.cardsets.placeholders[state.cardsets.activePlaceholder].fontVariant || DEFAULT_FONT_VARIANT
            : DEFAULT_FONT_VARIANT;
    const activeFontSize =
        state.cardsets.placeholders && state.cardsets.activePlaceholder
            ? state.cardsets.placeholders[state.cardsets.activePlaceholder].fontSize || DEFAULT_FONT_SIZE
            : DEFAULT_FONT_SIZE;
    return {
        activeFont,
        activeFontVariant,
        activeFontSize,
    };
};

export default connect(mapStateToProps)(FontSelector);
