export function saveTokens(data: { accessToken: string; refreshToken: string }) {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
}

export function saveAccessToken(accessToken: string) {
    localStorage.setItem('accessToken', accessToken);
}

export function cleanTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
}

export function getTokenFromStorage() {
    let token = localStorage.getItem('accessToken') || null;
    return token;
}

export function getRefreshTokenFromStorage() {
    let token = localStorage.getItem('refreshToken') || null;
    return token;
}
