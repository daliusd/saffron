import axios from 'axios';

export function handleAxiosError(error) {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        // error.response.status);
        throw new Error(error.response.data.message);
    } else if (error.request) {
        console.log(error.request);
        throw new Error(error.request);
    } else {
        throw new Error('Unknown error :(');
    }
}

export function getTokens(creds) {
    return axios
        .post('/api/tokens', creds)
        .then(resp => {
            return resp.data;
        })
        .catch(error => {
            handleAxiosError(error);
        });
}

export function refreshToken(refresh_token) {
    let config = {
        headers: { Authorization: `Bearer ${refresh_token}` },
    };
    return axios
        .post('/api/access_tokens', {}, config)
        .then(resp => {
            return resp.data.access_token;
        })
        .catch(error => {
            handleAxiosError(error);
        });
}

export function deleteAccessToken(token) {
    let config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    return axios
        .delete('/api/access_tokens', config)
        .then(resp => {
            return resp.data;
        })
        .catch(error => {
            if (error.response.status === 401) return {};
            handleAxiosError(error);
        });
}

export function deleteRefreshToken(token) {
    let config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    return axios
        .delete('/api/refresh_tokens', config)
        .then(resp => {
            return resp.data;
        })
        .catch(error => {
            if (error.response.status === 401) return {};
            handleAxiosError(error);
        });
}

export function registerUser(creds) {
    return axios
        .post('/api/users', creds)
        .then(resp => {
            return resp.data;
        })
        .catch(error => {
            handleAxiosError(error);
        });
}

export function getRequest(url, token) {
    let config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    return axios
        .get(url, config)
        .then(resp => {
            return resp.data;
        })
        .catch(error => {
            handleAxiosError(error);
        });
}

export function postRequest(url, token, data) {
    let config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    return axios
        .post(url, data, config)
        .then(resp => {
            return resp.data;
        })
        .catch(error => {
            handleAxiosError(error);
        });
}

export function putRequest(url, token, data) {
    let config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    return axios
        .put(url, data, config)
        .then(resp => {
            return resp.data;
        })
        .catch(error => {
            handleAxiosError(error);
        });
}
