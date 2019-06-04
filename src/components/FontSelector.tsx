import { connect } from 'react-redux';
import React, { Component } from 'react';
import Select from 'react-select';
import WebFont from 'webfontloader';

import { DEFAULT_LINE_HEIGHT } from '../constants';
import {
    Dispatch,
    cardSetChangeActiveTextFieldFontFamilyAndVariant,
    cardSetChangeActiveTextFieldFontSize,
    cardSetChangeActiveTextFieldFontVariant,
    cardSetChangeActiveTextFieldLineHeight,
} from '../actions';
import { State } from '../reducers';
import style from './FontSelector.module.css';
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

interface StateProps {
    activeFont: string;
    activeFontVariant: string;
    activeFontSize: number;
    activeLineHeight: number;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = StateProps & DispatchProps;

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
                dispatch(cardSetChangeActiveTextFieldFontFamilyAndVariant(fontFamily, fontVariant));
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
                dispatch(cardSetChangeActiveTextFieldFontVariant(value));
            },
        });
    };

    handleFontSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { dispatch } = this.props;
        dispatch(cardSetChangeActiveTextFieldFontSize(parseFloat(event.target.value)));
    };

    handleLineHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { dispatch } = this.props;
        dispatch(cardSetChangeActiveTextFieldLineHeight(parseFloat(event.target.value)));
    };

    render() {
        const selectedFontFamily = options.find(f => f.value === this.props.activeFont);

        const fontVariantOptions: FontOption[] = Object.keys((webfonts as WebFontsInfo)[this.props.activeFont])
            .sort()
            .map(fv => ({ value: fv, label: fv }));

        const selectedFontVariant = fontVariantOptions.find(f => f.value === this.props.activeFontVariant);

        return (
            <>
                <input
                    type="number"
                    value={this.props.activeFontSize}
                    onChange={this.handleFontSizeChange}
                    title="Font size"
                />
                <Select
                    className={style.fontFamily}
                    value={selectedFontFamily}
                    onChange={this.handleChange}
                    options={options}
                />
                <Select
                    className={style.fontVariant}
                    value={selectedFontVariant}
                    onChange={this.handleFontVariantChange}
                    options={fontVariantOptions}
                />
                <input
                    type="number"
                    value={this.props.activeLineHeight}
                    onChange={this.handleLineHeightChange}
                    title="Line height"
                    step="0.01"
                />
            </>
        );
    }
}

const mapStateToProps = (state: State): StateProps => {
    let activeFont = state.cardset.present.textSettings.fontFamily;
    let activeFontVariant = state.cardset.present.textSettings.fontVariant;
    let activeFontSize = state.cardset.present.textSettings.fontSize;
    let activeLineHeight = state.cardset.present.textSettings.lineHeight || DEFAULT_LINE_HEIGHT;

    return {
        activeFont,
        activeFontVariant,
        activeFontSize,
        activeLineHeight,
    };
};

export default connect<StateProps, DispatchProps, {}, State>(mapStateToProps)(FontSelector);
