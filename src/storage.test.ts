import { saveTokens, getTokenFromStorage, getRefreshTokenFromStorage, saveAccessToken, cleanTokens } from './storage';

test('storage tokens', () => {
    expect(getTokenFromStorage()).toBeNull();
    expect(getRefreshTokenFromStorage()).toBeNull();

    let access_token = '_access_token_';
    let refresh_token = '_refresh_token_';
    saveTokens({ access_token, refresh_token });

    expect(getTokenFromStorage()).toEqual(access_token);
    expect(getRefreshTokenFromStorage()).toEqual(refresh_token);

    saveAccessToken('_access_token_changed_');
    expect(getTokenFromStorage()).toEqual('_access_token_changed_');

    cleanTokens();
    expect(getTokenFromStorage()).toBeNull();
    expect(getRefreshTokenFromStorage()).toBeNull();
});
