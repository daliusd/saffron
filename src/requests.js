import axios from 'axios';

export function getTokens(creds) {
    return axios
        .post('/token', creds)
        .then(resp => {
            return resp.data;
        })
        .catch(error => {
            throw error;
        });
}

export function refreshToken(refresh_token) {
    let config = {
        headers: { Authorization: `Bearer ${refresh_token}` },
    };
    return axios
        .post('/token_access', {}, config)
        .then(resp => {
            return resp.data.access_token;
        })
        .catch(error => {
            throw error;
        });
}

export function deleteAccessToken(token) {
    let config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    return axios
        .delete('/token_access', config)
        .then(resp => {
            return resp.data;
        })
        .catch(error => {
            if (error.response.status === 401) return {};
            throw error;
        });
}

export function deleteRefreshToken(token) {
    let config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    return axios
        .delete('/token_refresh', config)
        .then(resp => {
            return resp.data;
        })
        .catch(error => {
            if (error.response.status === 401) return {};
            throw error;
        });
}

export function getQuote(url, token) {
    let config = {};
    if (token) {
        config = {
            headers: { Authorization: `Bearer ${token}` },
        };
    }

    return axios
        .get(url, config)
        .then(resp => {
            return resp.data;
        })
        .catch(error => {
            throw error;
        });
}
