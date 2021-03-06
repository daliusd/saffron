import axios from 'axios';
import StackTrace from 'stacktrace-js';

import { ImageFieldInfo, ImageToDraw } from './types';
import { store } from './store';

export function downloadBlob(blobURL: string, filename: string, resolve?: () => void) {
    const tempLink = document.createElement('a');
    tempLink.style.display = 'none';
    tempLink.href = blobURL;
    tempLink.setAttribute('download', filename);
    if (typeof tempLink.download === 'undefined') {
        tempLink.setAttribute('target', '_blank');
    }
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
    setTimeout(() => {
        window.URL.revokeObjectURL(blobURL);
        if (resolve) resolve();
    }, 100);
}

export function rotateVec(x: number, y: number, a: number) {
    const sinA = Math.sin(a);
    const cosA = Math.cos(a);
    const rx = cosA * x - sinA * y;
    const ry = sinA * x + cosA * y;

    return { rx, ry };
}

export function calculateImageDimensions(imageFieldInfo: ImageFieldInfo | ImageToDraw) {
    let calculatedImageWidth, calculatedImageHeight;
    let imageWidth = imageFieldInfo.imageWidth || 1;
    let imageHeight = imageFieldInfo.imageHeight || 1;

    if (!imageFieldInfo.fit || imageFieldInfo.fit === 'width') {
        calculatedImageWidth = imageFieldInfo.width;
        calculatedImageHeight = (imageFieldInfo.width * imageHeight) / imageWidth;
    } else if (imageFieldInfo.fit === 'height') {
        calculatedImageWidth = (imageFieldInfo.height * imageWidth) / imageHeight;
        calculatedImageHeight = imageFieldInfo.height;
    } else {
        // strech
        calculatedImageWidth = imageFieldInfo.width;
        calculatedImageHeight = imageFieldInfo.height;
    }

    calculatedImageWidth *= imageFieldInfo.zoom || 1;
    calculatedImageHeight *= imageFieldInfo.zoom || 1;

    return { width: calculatedImageWidth, height: calculatedImageHeight };
}

export class UserError extends Error {}

export function reportError(error: Error) {
    if (error instanceof UserError) {
        return;
    }

    StackTrace.fromError(error).then(stackframes => {
        var stringifiedStack = stackframes
            .map(function(sf) {
                return sf.toString();
            })
            .join('\n');

        if (process.env.NODE_ENV === 'production') {
            let state = '';
            if (store) {
                state = JSON.stringify(store.getState());
            }
            axios.post('/api/reports', { message: error.message, stack: stringifiedStack, state });
        } else {
            console.log(stringifiedStack);
        }
    });
}
