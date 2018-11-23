export const loginRequest = creds => {
    return {
        type: 'LOGIN_REQUEST',
        creds: creds,
    };
};

export const logoutRequest = () => {
    return {
        type: 'LOGOUT_REQUEST',
    };
};

export const quoteRequest = () => {
    return {
        type: 'QUOTE_REQUEST',
        url: '/fortune',
        auth: false,
    };
};

export const secretQuoteRequest = () => {
    return {
        type: 'QUOTE_REQUEST',
        url: '/fortunedebian',
        auth: true,
    };
};
