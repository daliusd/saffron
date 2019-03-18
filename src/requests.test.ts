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
const mockedAxios = axios as jest.Mocked<typeof axios>;

test('handleAxiosError request error', () => {
    expect(() => {
        handleAxiosError({ request: 'error', name: '', message: '', config: {} });
    }).toThrowError('error');
    expect(() => {
        handleAxiosError({ name: '', message: '', config: {} });
    }).toThrowError('Unknown error');
});

test('getTokens success', () => {
    mockedAxios.post.mockResolvedValue({ data: 'ok' });
    expect(getTokens({ username: 'username', password: '' })).resolves.toEqual('ok');
});

test('getTokens failure', async () => {
    mockedAxios.post.mockRejectedValue({ response: { data: { message: 'error' } } });
    expect(getTokens({ username: 'username', password: '' })).rejects.toEqual(Error('error'));
});

test('refreshToken success', () => {
    mockedAxios.post.mockResolvedValue({ data: { accessToken: 'at' } });
    expect(refreshToken('rt')).resolves.toEqual('at');
});

test('refreshToken failure', async () => {
    mockedAxios.post.mockRejectedValue({ response: { data: { message: 'error' } } });
    expect(refreshToken('rt')).rejects.toEqual(Error('error'));
});

test('deleteAccessToken success', () => {
    mockedAxios.delete.mockResolvedValue({ data: 'ok' });
    expect(deleteAccessToken('at')).resolves.toEqual('ok');
});

test('deleteAccessToken failure', async () => {
    let response = { status: 403, data: { message: 'error' } };
    mockedAxios.delete.mockRejectedValue({ response });
    expect(deleteAccessToken('at')).rejects.toEqual(Error('error'));
});

test('deleteAccessToken attempt to delete with invalid token', async () => {
    let response = { status: 401 };
    mockedAxios.delete.mockRejectedValue({ response });
    expect(deleteAccessToken('at')).resolves.toEqual({});
});

test('deleteRefreshToken success', () => {
    mockedAxios.delete.mockResolvedValue({ data: 'ok' });
    expect(deleteRefreshToken('at')).resolves.toEqual('ok');
});

test('deleteRefreshToken failure', async () => {
    let response = { status: 403, data: { message: 'error' } };
    mockedAxios.delete.mockRejectedValue({ response });
    expect(deleteRefreshToken('at')).rejects.toEqual(Error('error'));
});

test('deleteRefreshToken attempt to delete with invalid token', async () => {
    let response = { status: 401 };
    mockedAxios.delete.mockRejectedValue({ response });
    expect(deleteRefreshToken('at')).resolves.toEqual({});
});

test('registerUser success', () => {
    mockedAxios.post.mockResolvedValue({ data: 'ok' });
    expect(registerUser({ username: 'username', password: '' })).resolves.toEqual('ok');
});

test('registerUser failure', async () => {
    mockedAxios.post.mockRejectedValue({ response: { data: { message: 'error' } } });
    expect(registerUser({ username: 'username', password: '' })).rejects.toEqual(Error('error'));
});

test('getRequest success', () => {
    mockedAxios.get.mockResolvedValue({ data: 'data' });
    expect(getRequest('/ok', 'token')).resolves.toEqual({ data: 'data' });
});

test('getRequest failure', async () => {
    mockedAxios.get.mockRejectedValue({ response: { data: { message: 'error' } } });
    expect(getRequest('/ok', 'token')).rejects.toEqual(Error('error'));
});

test('postRequest success', () => {
    mockedAxios.post.mockResolvedValue({ data: 'data' });
    expect(postRequest('/ok', 'token', {})).resolves.toEqual('data');
});

test('postRequest failure', async () => {
    mockedAxios.post.mockRejectedValue({ response: { data: { message: 'error' } } });
    expect(postRequest('/ok', 'token', {})).rejects.toEqual(Error('error'));
});

test('putRequest success', () => {
    mockedAxios.put.mockResolvedValue({ data: 'data' });
    expect(putRequest('/ok', 'token', {})).resolves.toEqual('data');
});

test('putRequest failure', async () => {
    mockedAxios.put.mockRejectedValue({ response: { data: { message: 'error' } } });
    expect(putRequest('/ok', 'token', {})).rejects.toEqual(Error('error'));
});
