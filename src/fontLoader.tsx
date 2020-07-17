import WebFont from 'webfontloader';

import { DEFAULT_FONT } from './constants';
import { CardSetSelectSuccessDataV3 } from './actions';

const webFontsLoadPromise = (config: WebFont.Config) =>
    new Promise((resolve, reject) => {
        WebFont.load({ ...config, active: resolve, inactive: reject });
    });

export const loadFontsUsedInPlaceholders = (data: CardSetSelectSuccessDataV3) => {
    if (!('fieldsAllIds' in data)) {
        return;
    }

    const fontsToLoad: Set<string> = new Set();
    fontsToLoad.add(DEFAULT_FONT);
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

    const config: WebFont.Config = {
        google: {
            families: [...Array.from(fontsToLoad)],
        },
    };

    return webFontsLoadPromise(config);
};
