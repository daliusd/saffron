import { Provider } from 'react-redux';
import React from 'react';
import { mount } from 'enzyme';

import { createAppStore } from './store';

import Main from './Main';

const store = createAppStore();

describe('<App />', () => {
    it('Generates App', () => {
        mount(
            <Provider store={store}>
                <Main />
            </Provider>,
        );
    });
});
