// @flow
import axios from 'axios';

import {
    deleteAccessToken,
    deleteRefreshToken,
    getRequest,
    getTokens,
    handleAxiosError,
    postRequest,
    putRequest,
    refreshToken,
    registerUser,
} from './requests';

jest.mock('axios');

test('handleAxiosError request error', () => {
    expect(() => {
        handleAxiosError({ request: 'error' });
    }).toThrowError('error');
    expect(() => {
        handleAxiosError({});
    }).toThrowError('Unknown error');
});

test('getTokens success', () => {
    axios.post.mockResolvedValue({ data: 'ok' });
    expect(getTokens({ username: 'username' })).resolves.toEqual('ok');
});

test('getTokens failure', async () => {
    axios.post.mockRejectedValue({ response: { data: { message: 'error' } } });
    expect(getTokens({ username: 'username' })).rejects.toEqual(Error('error'));
});

test('refreshToken success', () => {
    axios.post.mockResolvedValue({ data: { access_token: 'at' } });
    expect(refreshToken('rt')).resolves.toEqual('at');
});

test('refreshToken failure', async () => {
    axios.post.mockRejectedValue({ response: { data: { message: 'error' } } });
    expect(refreshToken('rt')).rejects.toEqual(Error('error'));
});

test('deleteAccessToken success', () => {
    axios.delete.mockResolvedValue({ data: 'ok' });
    expect(deleteAccessToken('at')).resolves.toEqual('ok');
});

test('deleteAccessToken failure', async () => {
    let response = { status: 403, data: { message: 'error' } };
    axios.delete.mockRejectedValue({ response });
    expect(deleteAccessToken('at')).rejects.toEqual(Error('error'));
});

test('deleteAccessToken attempt to delete with invalid token', async () => {
    let response = { status: 401 };
    axios.delete.mockRejectedValue({ response });
    expect(deleteAccessToken('at')).resolves.toEqual({});
});

test('deleteRefreshToken success', () => {
    axios.delete.mockResolvedValue({ data: 'ok' });
    expect(deleteRefreshToken('at')).resolves.toEqual('ok');
});

test('deleteRefreshToken failure', async () => {
    let response = { status: 403, data: { message: 'error' } };
    axios.delete.mockRejectedValue({ response });
    expect(deleteRefreshToken('at')).rejects.toEqual(Error('error'));
});

test('deleteRefreshToken attempt to delete with invalid token', async () => {
    let response = { status: 401 };
    axios.delete.mockRejectedValue({ response });
    expect(deleteRefreshToken('at')).resolves.toEqual({});
});

test('registerUser success', () => {
    axios.post.mockResolvedValue({ data: 'ok' });
    expect(registerUser({ username: 'username' })).resolves.toEqual('ok');
});

test('registerUser failure', async () => {
    axios.post.mockRejectedValue({ response: { data: { message: 'error' } } });
    expect(registerUser({ username: 'username' })).rejects.toEqual(Error('error'));
});

test('getRequest success', () => {
    axios.get.mockResolvedValue({ data: 'data' });
    expect(getRequest('/ok', 'token')).resolves.toEqual('data');
});

test('getRequest failure', async () => {
    axios.get.mockRejectedValue({ response: { data: { message: 'error' } } });
    expect(getRequest('/ok', 'token')).rejects.toEqual(Error('error'));
});

test('postRequest success', () => {
    axios.post.mockResolvedValue({ data: 'data' });
    expect(postRequest('/ok', 'token', {})).resolves.toEqual('data');
});

test('postRequest failure', async () => {
    axios.post.mockRejectedValue({ response: { data: { message: 'error' } } });
    expect(postRequest('/ok', 'token', {})).rejects.toEqual(Error('error'));
});

test('putRequest success', () => {
    axios.put.mockResolvedValue({ data: 'data' });
    expect(putRequest('/ok', 'token', {})).resolves.toEqual('data');
});

test('putRequest failure', async () => {
    axios.put.mockRejectedValue({ response: { data: { message: 'error' } } });
    expect(putRequest('/ok', 'token', {})).rejects.toEqual(Error('error'));
});
