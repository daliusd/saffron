import axios from 'axios';
import { downloadBlob, calculateImageDimensions } from './utils';
import { delay } from 'redux-saga';
import { XmlDocument } from 'xmldoc';
import JSZip from 'jszip';
import { getRequest } from './requests';
import { CardSetData, ImageToDraw, ImageType } from './types';

const SVG_B64_START = 'data:image/svg+xml;base64,';

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
    cutMarksInMarginArea: boolean,
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
                } else if (event.data.type === 'generateError') {
                    const error = event.data.error;
                    reject({ message: 'PDF generation failed', stack: error.stack });
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
                cutMarksInMarginArea,
                cutMarksOnFrontSideOnly,
            });
        } catch (e) {
            reject(e);
        }
    });
};

function loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject();

        img.src = url;
    });
}

function prepareImageToDrawSpace(context: CanvasRenderingContext2D, imageToDraw: ImageToDraw, ptpmm: number) {
    context.save();
    let x = (imageToDraw.x + imageToDraw.width / 2) * ptpmm;
    let y = (imageToDraw.y + imageToDraw.height / 2) * ptpmm;
    context.translate(x, y);
    context.rotate(imageToDraw.angle);
    let ax = (-imageToDraw.width / 2) * ptpmm;
    let ay = (-imageToDraw.height / 2) * ptpmm;
    context.translate(ax, ay);
    if (imageToDraw.crop) {
        context.rect(0, 0, imageToDraw.width * ptpmm, imageToDraw.height * ptpmm);
        context.clip();
    }
}

function fixWidthAndHeightInSvg(data: string) {
    const doc = new XmlDocument(data);
    if (!('width' in doc.attr) || !('height' in doc.attr)) {
        const viewBox = doc.attr['viewBox'].split(' ');
        doc.attr['width'] = viewBox[2];
        doc.attr['height'] = viewBox[3];
    }

    return btoa(doc.toString({ compressed: true }));
}

class PNGGenerator {
    tasksQueue: {
        type: string;
        subType: string;
        imageToDraw?: ImageToDraw;
        error?: { message: string; stack: string };
    }[] = [];
    worker: Worker;

    constructor() {
        // @ts-ignore
        if (!window.Worker) {
            throw new Error('We can not generate PNG because of browser you use. Try using different browser');
        }

        this.worker = new Worker('/js/worker.js');
        this.worker.addEventListener('message', event => {
            if (event.data.type === 'generateCard' || event.data.type === 'generateError') {
                this.tasksQueue.push(event.data);
            }
        });
    }

    async generateCard(
        cardSetData: CardSetData,
        cardId: string,
        cardIdx: number,
        dpi: number,
        isBack: boolean,
        cardsetFolder: JSZip,
    ) {
        this.worker.postMessage({
            type: 'generateCard',
            cardSetData,
            cardId,
            isBack,
        });

        let offscreenCanvas = document.createElement('canvas');

        const calculatedWidth = Math.round(dpi * (cardSetData.width / 25.4 + 1 / 4));
        const calculatedHeight = Math.round(dpi * (cardSetData.height / 25.4 + 1 / 4));

        offscreenCanvas.width = calculatedWidth;
        offscreenCanvas.height = calculatedHeight;
        var context = offscreenCanvas.getContext('2d');
        if (context === null) {
            throw new Error('We cannot generate PNG because of unknown reason. Try different browser.');
        }
        context.fillStyle = 'white';
        context.fillRect(0, 0, calculatedWidth, calculatedHeight);

        let stopped = false;

        const ptpmm = dpi / 25.4;

        while (!stopped) {
            while (this.tasksQueue.length > 0) {
                let task = this.tasksQueue.shift();

                if (task && task.imageToDraw) {
                    const imageToDraw = task.imageToDraw;

                    if (imageToDraw.type === ImageType.SVG_PATH) {
                        prepareImageToDrawSpace(context, imageToDraw, ptpmm);
                        if (imageToDraw.scale && imageToDraw.color) {
                            context.fillStyle = imageToDraw.color;
                            context.scale(imageToDraw.scale * ptpmm, imageToDraw.scale * ptpmm);
                            var p = new Path2D(imageToDraw.data);
                            context.fill(p);
                        }
                        context.restore();
                    } else if (imageToDraw.type === ImageType.IMAGE || imageToDraw.type === ImageType.SVG) {
                        prepareImageToDrawSpace(context, imageToDraw, ptpmm);

                        if (imageToDraw.cx && imageToDraw.cy) {
                            context.translate(imageToDraw.cx * ptpmm, imageToDraw.cy * ptpmm);
                        }
                        let dim = calculateImageDimensions(imageToDraw);

                        let image;
                        if (imageToDraw.type === ImageType.SVG) {
                            let svgData = fixWidthAndHeightInSvg(atob(imageToDraw.data));
                            image = await loadImage(SVG_B64_START + svgData);
                        } else {
                            let resp = await axios.get(imageToDraw.data);
                            if (resp.headers['content-type'] === 'image/svg+xml') {
                                let svgData = fixWidthAndHeightInSvg(resp.data);
                                image = await loadImage(SVG_B64_START + svgData);
                            } else {
                                image = await loadImage(imageToDraw.data);
                            }
                        }

                        context.drawImage(image, 0, 0, dim.width * ptpmm, dim.height * ptpmm);

                        context.restore();
                    } else if (imageToDraw.type === ImageType.BLOCK_START) {
                        prepareImageToDrawSpace(context, imageToDraw, ptpmm);
                    } else if (imageToDraw.type === ImageType.BLOCK_END) {
                        context.restore();
                    }
                }

                if (task && task.subType === 'stop') {
                    stopped = true;
                }

                if (task && task.type === 'generateError' && task.error) {
                    let error = Error('Failed to generate PNG');
                    error.stack = task.error.stack;
                    throw error;
                }
            }
            if (!stopped) {
                await delay(100);
            }
        }

        let dataUrl = offscreenCanvas.toDataURL();
        dataUrl = dataUrl.slice('data:image/png;base64,'.length);
        cardsetFolder.file(
            `${cardIdx.toString().padStart(4, '0')}_${cardId}_${isBack ? 'back' : 'front'}.png`,
            dataUrl,
            { base64: true },
        );
    }

    async generateGame(accessToken: string, gameId: string, dpi: number, zip: JSZip) {
        let resp = await getRequest('/api/games/' + gameId, accessToken);
        if (!resp) return;

        const cardsetsList = resp.data.cardsets;
        for (const cardsetInfo of cardsetsList) {
            await this.generateCardset(accessToken, cardsetInfo.id, dpi, zip);
        }
    }

    async generateCardset(accessToken: string, cardsetId: string, dpi: number, zip: JSZip) {
        const resp = await getRequest('/api/cardsets/' + cardsetId, accessToken);
        if (!resp) return;

        let cardSetData: CardSetData = JSON.parse(resp.data.data);

        let cardsetFolder = zip.folder(resp.data.name);

        for (const [cardIdx, cardId] of cardSetData.cardsAllIds.entries()) {
            await this.generateCard(cardSetData, cardId, cardIdx, dpi, false, cardsetFolder);
            if (cardSetData.isTwoSided) {
                await this.generateCard(cardSetData, cardId, cardIdx, dpi, true, cardsetFolder);
            }
        }
    }
}

export const generatePngUsingWorker = async (
    accessToken: string,
    collectionType: string,
    collectionId: string,
    dpi: number,
) => {
    const pngGenerator = new PNGGenerator();

    let zip = new JSZip();

    if (collectionType === 'games') {
        await pngGenerator.generateGame(accessToken, collectionId, dpi, zip);
    } else if (collectionType === 'cardsets') {
        await pngGenerator.generateCardset(accessToken, collectionId, dpi, zip);
    }

    let blob = await zip.generateAsync({ type: 'blob' });
    let url = window.URL.createObjectURL(blob);
    downloadBlob(url, 'cards.zip');
};
