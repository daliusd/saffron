import WebFont from 'webfontloader';

import { PlaceholdersCollection } from './actions';

export const DEFAULT_FONT = 'Roboto';
export const DEFAULT_FONT_VARIANT = 'regular';
export const DEFAULT_FONT_SIZE = 8;

const webFontsLoadPromise = (config: WebFont.Config) =>
    new Promise((resolve, reject) => {
        WebFont.load({ ...config, active: resolve, inactive: reject });
    });

export const loadFontsUsedInPlaceholders = (data: { placeholders: PlaceholdersCollection }) => {
    let fontsToLoad: Set<string> = new Set();
    fontsToLoad.add(DEFAULT_FONT);
    for (const plId in data.placeholders) {
        const pl = data.placeholders[plId];
        if (pl.type === 'text' && pl.fontFamily) {
            let fontToLoad = pl.fontFamily;
            if (pl.fontVariant && pl.fontVariant !== 'regular') {
                fontToLoad += ':' + pl.fontVariant;
            }

            fontsToLoad.add(fontToLoad);
        }
    }

    const config: WebFont.Config = {
        google: {
            families: [...Array.from(fontsToLoad)],
        },
    };

    return webFontsLoadPromise(config);
};
