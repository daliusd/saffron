import { downloadBlob } from './utils';

export const generatePdfUsingWorker = (
    accessToken: string,
    collectionType: string,
    collectionId: string,
    pageWidth: number,
    pageHeight: number,
    topBottomMargin: number,
    leftRightMargin: number,
    includeBleedingArea: boolean,
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
                accessToken,
                collectionType,
                collectionId,
                pageWidth,
                pageHeight,
                topBottomMargin,
                leftRightMargin,
                includeBleedingArea,
            });
        } catch (e) {
            reject(e);
        }
    });
};
