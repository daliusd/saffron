module.exports = {
    env: {
        browser: true,
        es6: true,
    },
    extends: ['react-app', 'plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    plugins: ['react'],
    rules: {
        'linebreak-style': ['error', 'unix'],
        quotes: ['error', 'single'],
        semi: ['error', 'always'],
        '@typescript-eslint/explicit-member-accessibility': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/camelcase': 'off',
        '@typescript-eslint/indent': 'off',
    },
};