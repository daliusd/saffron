import axios from 'axios';

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

export function reportError(error: string) {
    return axios.post('/api/reports', { error });
}
