import { Provider } from 'react-redux';
import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';

import { createAppStore } from './store';

import Main from './Main';

const store = createAppStore();

describe('<App />', () => {
    it('Generates App', () => {
        mount(
            <Provider store={store}>
                <Router>
                    <Main />
                </Router>
            </Provider>,
        );
    });
});
