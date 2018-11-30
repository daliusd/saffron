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

describe('<LoginPage />', () => {
    it('generates LoginPage', () => {
        const dispatch = jest.fn();
        const wrapper = shallow(<LoginPage dispatch={dispatch} isAuthenticated={false} />);
        wrapper.find('Login').prop('onLoginClick')('test');
        expect(dispatch.mock.calls.length).toBe(1);
    });

    it('redirects to / if authenticated', () => {
        const dispatch = jest.fn();
        const wrapper = shallow(<LoginPage dispatch={dispatch} isAuthenticated={true} />);
        expect(wrapper.find('Login')).toHaveLength(0);
        expect(wrapper.find('Redirect')).toHaveLength(1);
    });
});
