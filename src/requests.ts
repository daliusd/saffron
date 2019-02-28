import axios, { AxiosError, CancelToken } from 'axios';

import { Credentials } from './actions';

export function handleAxiosError(error: AxiosError) {
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

export function getTokens(creds: Credentials) {
    return axios
        .post('/api/tokens', creds)
        .then(resp => {
            return resp.data;
        })
        .catch(error => {
            handleAxiosError(error);
        });
}

export function refreshToken(refreshTokenValue: string) {
    let config = {
        headers: { Authorization: `Bearer ${refreshTokenValue}` },
    };
    return axios
        .post('/api/access_tokens', {}, config)
        .then(resp => {
            return resp.data.accessToken;
        })
        .catch(error => {
            handleAxiosError(error);
        });
}

export function deleteAccessToken(token: string) {
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

export function deleteRefreshToken(token: string) {
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

export function registerUser(creds: Credentials) {
    return axios
        .post('/api/users', creds)
        .then(resp => {
            return resp.data;
        })
        .catch(error => {
            handleAxiosError(error);
        });
}

export function getRequest(url: string, token: string) {
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

export function postRequest(url: string, token: string, data: object) {
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

export function postRequestFormDataCancelable(
    url: string,
    token: string,
    data: FormData,
    progressCallback: (event: ProgressEvent) => void,
    cancelToken: CancelToken,
    cancelCallback: () => void,
) {
    let config = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
        cancelToken,
        onUploadProgress: progressCallback,
    };

    return axios
        .post(url, data, config)
        .then(resp => {
            return resp.data;
        })
        .catch(error => {
            if (axios.isCancel(error)) {
                cancelCallback();
            } else {
                handleAxiosError(error);
            }
        });
}

export function putRequest(url: string, token: string, data: object) {
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
