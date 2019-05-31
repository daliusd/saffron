import WebFont from 'webfontloader';

import { DEFAULT_FONT } from './constants';
import { CardSetSelectSuccessData } from './actions';

const webFontsLoadPromise = (config: WebFont.Config) =>
    new Promise((resolve, reject) => {
        WebFont.load({ ...config, active: resolve, inactive: reject });
    });

export const loadFontsUsedInPlaceholders = (data: CardSetSelectSuccessData) => {
    let fontsToLoad: Set<string> = new Set();
    fontsToLoad.add(DEFAULT_FONT);
    if (data.version === 2) {
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
    } else if (data.version === 3) {
        for (const fieldId of data.fieldsAllIds) {
            const field = data.fields[data.cardsAllIds[0]][fieldId];
            if (field && field.type === 'text' && field.fontFamily) {
                let fontToLoad = field.fontFamily;
                if (field.fontVariant && field.fontVariant !== 'regular') {
                    fontToLoad += ':' + field.fontVariant;
                }

                fontsToLoad.add(fontToLoad);
            }
        }
    }

    const config: WebFont.Config = {
        google: {
            families: [...Array.from(fontsToLoad)],
        },
    };

    return webFontsLoadPromise(config);
};
