export function saveTokens(data) {
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
}

export function saveAccessToken(access_token) {
    localStorage.setItem('access_token', access_token);
}

export function cleanTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
}

export function getTokenFromStorage() {
    let token = localStorage.getItem('access_token') || null;
    return token;
}

export function getRefreshTokenFromStorage() {
    let token = localStorage.getItem('refresh_token') || null;
    return token;
}
