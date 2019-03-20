import {
    CardsCollection,
    PlaceholdersCollection,
    PlaceholdersImageInfoByCardCollection,
    PlaceholdersTextInfoByCardCollection,
} from './actions';
import { downloadBlob } from './utils';

export const generatePdfUsingWorker = (
    width: number,
    height: number,
    isTwoSided: boolean,
    cardsAllIds: string[],
    cardsById: CardsCollection,
    placeholders: PlaceholdersCollection,
    placeholdersAllIds: string[],
    texts: PlaceholdersTextInfoByCardCollection,
    images: PlaceholdersImageInfoByCardCollection,
    pageWidth: number,
    pageHeight: number,
    topBottomMargin: number,
    leftRightMargin: number,
) => {
    // @ts-ignore
    if (!window.Worker) {
        throw new Error('We can not generate PDF because of browser you use. Try using different browser');
    }

    return new Promise((resolve, reject) => {
        try {
            const worker = new Worker('/js/worker.js');
            worker.addEventListener('message', event => {
                const blobURL = event.data;
                downloadBlob(blobURL, 'card.pdf', resolve);
            });

            worker.postMessage({
                width,
                height,
                isTwoSided,
                cardsAllIds,
                cardsById,
                placeholders,
                placeholdersAllIds,
                texts,
                images,
                pageWidth,
                pageHeight,
                topBottomMargin,
                leftRightMargin,
            });
        } catch (e) {
            reject(e);
        }
    });
};
