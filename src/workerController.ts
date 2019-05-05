import { downloadBlob } from './utils';

export const generatePdfUsingWorker = (
    accessToken: string,
    collectionType: string,
    collectionId: string,
    pageWidth: number,
    pageHeight: number,
    topBottomMargin: number,
    leftRightMargin: number,
    verticalSpace: number,
    horizontalSpace: number,
    includeBleedingArea: boolean,
    cutMarksForScissors: boolean,
    cutMarksForGuillotine: boolean,
    cutMarksOnFrontSideOnly: boolean,
) => {
    // @ts-ignore
    if (!window.Worker) {
        throw new Error('We can not generate PDF because of browser you use. Try using different browser');
    }

    return new Promise((resolve, reject) => {
        try {
            const worker = new Worker('/js/worker.js');
            worker.addEventListener('message', event => {
                if (event.data.type === 'generatePdf') {
                    const blobURL = event.data.url;
                    downloadBlob(blobURL, 'card.pdf', resolve);
                }
            });

            worker.postMessage({
                type: 'generatePdf',
                accessToken,
                collectionType,
                collectionId,
                pageWidth,
                pageHeight,
                topBottomMargin,
                leftRightMargin,
                verticalSpace,
                horizontalSpace,
                includeBleedingArea,
                cutMarksForScissors,
                cutMarksForGuillotine,
                cutMarksOnFrontSideOnly,
            });
        } catch (e) {
            reject(e);
        }
    });
};
