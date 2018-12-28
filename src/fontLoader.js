import WebFont from 'webfontloader';

export const DEFAULT_FONT = 'Roboto';
export const DEFAULT_FONT_VARIANT = 'regular';
export const DEFAULT_FONT_SIZE = '16';

const webFontsLoadPromise = config =>
    new Promise((resolve, reject) => {
        WebFont.load({ ...config, active: resolve, inactive: reject });
    });

export const loadFontsUsedInPlaceholders = data => {
    let fontsToLoad = new Set();
    fontsToLoad.add(DEFAULT_FONT);
    for (const plId in data.placeholders) {
        const pl = data.placeholders[plId];
        if (pl.fontFamily) {
            let fontToLoad = pl.fontFamily;
            if (pl.fontVariant && pl.fontVariant !== 'regular') {
                fontToLoad += ':' + pl.fontVariant;
            }

            fontsToLoad.add(fontToLoad);
        }
    }

    return webFontsLoadPromise({
        google: {
            families: [...fontsToLoad],
        },
    });
};
