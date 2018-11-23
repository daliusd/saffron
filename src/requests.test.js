// @flow
import axios from 'axios';

import { deleteAccessToken, deleteRefreshToken, getRequest, getTokens, postRequest, refreshToken } from './requests';

jest.mock('axios');

test('getTokens success', () => {
    axios.post.mockResolvedValue({ data: 'ok' });
    expect(getTokens({ username: 'username' })).resolves.toEqual('ok');
});

test('getTokens failure', async () => {
    axios.post.mockRejectedValue('error');
    expect(getTokens({ username: 'username' })).rejects.toEqual('error');
});

test('refreshToken success', () => {
    axios.post.mockResolvedValue({ data: { access_token: 'at' } });
    expect(refreshToken('rt')).resolves.toEqual('at');
});

test('refreshToken failure', async () => {
    axios.post.mockRejectedValue('error');
    expect(refreshToken('rt')).rejects.toEqual('error');
});

test('deleteAccessToken success', () => {
    axios.delete.mockResolvedValue({ data: 'ok' });
    expect(deleteAccessToken('at')).resolves.toEqual('ok');
});

test('deleteAccessToken failure', async () => {
    let response = { status: 403 };
    axios.delete.mockRejectedValue({ response });
    expect(deleteAccessToken('at')).rejects.toEqual({ response });
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
    let response = { status: 403 };
    axios.delete.mockRejectedValue({ response });
    expect(deleteRefreshToken('at')).rejects.toEqual({ response });
});

test('deleteRefreshToken attempt to delete with invalid token', async () => {
    let response = { status: 401 };
    axios.delete.mockRejectedValue({ response });
    expect(deleteRefreshToken('at')).resolves.toEqual({});
});

test('getRequest success', () => {
    axios.get.mockResolvedValue({ data: 'data' });
    expect(getRequest('/ok', 'token')).resolves.toEqual('data');
});

test('getRequest failure', async () => {
    axios.get.mockRejectedValue('error');
    expect(getRequest('/ok', 'token')).rejects.toEqual('error');
});

test('postRequest success', () => {
    axios.post.mockResolvedValue({ data: 'data' });
    expect(postRequest('/ok', 'token', {})).resolves.toEqual('data');
});

test('postRequest failure', async () => {
    axios.post.mockRejectedValue('error');
    expect(postRequest('/ok', 'token', {})).rejects.toEqual('error');
});
