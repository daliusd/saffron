import {
    CardsCollection,
    PlaceholdersCollection,
    PlaceholdersImageInfoByCardCollection,
    PlaceholdersTextInfoByCardCollection,
} from './actions';

export const generatePdfUsingWorker = (
    width: number,
    height: number,
    cardsAllIds: string[],
    cardsById: CardsCollection,
    placeholders: PlaceholdersCollection,
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

                const tempLink = document.createElement('a');
                tempLink.style.display = 'none';
                tempLink.href = blobURL;
                tempLink.setAttribute('download', 'card.pdf');
                if (typeof tempLink.download === 'undefined') {
                    tempLink.setAttribute('target', '_blank');
                }
                document.body.appendChild(tempLink);
                tempLink.click();
                document.body.removeChild(tempLink);
                setTimeout(() => {
                    window.URL.revokeObjectURL(blobURL);
                    resolve();
                }, 100);
            });

            worker.postMessage({
                width,
                height,
                cardsAllIds,
                cardsById,
                placeholders,
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
