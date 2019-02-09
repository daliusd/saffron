import { saveTokens, getTokenFromStorage, getRefreshTokenFromStorage, saveAccessToken, cleanTokens } from './storage';

test('storage tokens', () => {
    expect(getTokenFromStorage()).toBeNull();
    expect(getRefreshTokenFromStorage()).toBeNull();

    let accessToken = '_access_token_';
    let refreshToken = '_refresh_token_';
    saveTokens({ accessToken, refreshToken });

    expect(getTokenFromStorage()).toEqual(accessToken);
    expect(getRefreshTokenFromStorage()).toEqual(refreshToken);

    saveAccessToken('_access_token_changed_');
    expect(getTokenFromStorage()).toEqual('_access_token_changed_');

    cleanTokens();
    expect(getTokenFromStorage()).toBeNull();
    expect(getRefreshTokenFromStorage()).toBeNull();
});
