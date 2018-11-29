// @flow
import { Provider } from 'react-redux';
import { mount, shallow } from 'enzyme';
import React from 'react';

import { createAppStore } from './store';
import ConnectedLoginPage, { LoginPage } from './LoginPage';

const store = createAppStore();

it('renders without crashing', () => {
    mount(
        <Provider store={store}>
            <ConnectedLoginPage />
        </Provider>,
    );
});

describe('<App />', () => {
    it('Generates App', () => {
        const dispatch = jest.fn();
        const wrapper = shallow(<LoginPage dispatch={dispatch} />);
        wrapper.find('Login').prop('onLoginClick')('test');
        expect(dispatch.mock.calls.length).toBe(1);
    });
});
