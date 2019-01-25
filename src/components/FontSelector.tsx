import { connect } from 'react-redux';
import React, { Component } from 'react';
import Select from 'react-select';
import WebFont from 'webfontloader';

import { DEFAULT_FONT, DEFAULT_FONT_SIZE, DEFAULT_FONT_VARIANT } from '../fontLoader';
import {
    Dispatch,
    cardSetChangeActiveTextPlaceholderFontFamilyAndVariant,
    cardSetChangeActiveTextPlaceholderFontSize,
    cardSetChangeActiveTextPlaceholderFontVariant,
} from '../actions';
import { State } from '../reducers';
import webfonts from './webfonts.json';

interface WebFontsInfo {
    [propName: string]: {
        [propName: string]: string;
    };
}

interface FontOption {
    value: string;
    label: string;
}

const options: FontOption[] = Object.keys(webfonts)
    .sort()
    .map(fi => ({ value: fi, label: fi }));

interface Props {
    dispatch: Dispatch;
    activeFont: string;
    activeFontVariant: string;
    activeFontSize: string;
}

class FontSelector extends Component<Props> {
    getFontStringForLoad = (family: string, variant: string) => {
        let stringForLoad = family;
        if (variant !== 'regular') {
            stringForLoad += ':' + variant;
        }
        return stringForLoad;
    };

    handleChange = (selectedOption?: FontOption | FontOption[] | null) => {
        if (!selectedOption) return;

        const fontFamily = (selectedOption as FontOption).value;

        let fontVariant = this.props.activeFontVariant;
        const wf: WebFontsInfo = webfonts;
        if (!(fontVariant in wf[fontFamily])) {
            fontVariant = Object.keys(wf[fontFamily]).sort()[0];
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

    handleFontVariantChange = (selectedOption?: FontOption | FontOption[] | null) => {
        if (!selectedOption) return;

        const value = (selectedOption as FontOption).value;
        WebFont.load({
            google: {
                families: [this.getFontStringForLoad(this.props.activeFont, value)],
            },
            active: () => {
                const { dispatch } = this.props;
                dispatch(cardSetChangeActiveTextPlaceholderFontVariant(value));
            },
        });
    };

    handleFontSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { dispatch } = this.props;
        dispatch(cardSetChangeActiveTextPlaceholderFontSize(event.target.value));
    };

    render() {
        const selectedFontFamily = options.find(f => f.value === this.props.activeFont);

        const fontVariantOptions: FontOption[] = Object.keys((webfonts as WebFontsInfo)[this.props.activeFont])
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

const mapStateToProps = (state: State) => {
    let activeFont = DEFAULT_FONT;
    let activeFontVariant = DEFAULT_FONT_VARIANT;
    let activeFontSize = DEFAULT_FONT_SIZE;

    if (state.cardsets.placeholders && state.cardsets.activePlaceholder) {
        const placeholder = state.cardsets.placeholders[state.cardsets.activePlaceholder];
        if (placeholder.type === 'text') {
            activeFont = placeholder.fontFamily || DEFAULT_FONT;
            activeFontVariant = placeholder.fontVariant || DEFAULT_FONT_VARIANT;
            activeFontSize = placeholder.fontSize || DEFAULT_FONT_SIZE;
        }
    }

    return {
        activeFont,
        activeFontVariant,
        activeFontSize,
    };
};

export default connect(mapStateToProps)(FontSelector);
