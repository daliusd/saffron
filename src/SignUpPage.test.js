// @flow
import { Provider } from 'react-redux';
import { mount, shallow } from 'enzyme';
import React from 'react';

import { createAppStore } from './store';
import ConnectedSignUpPage, { SignUpPage } from './SignUpPage';

const store = createAppStore();

it('renders without crashing', () => {
    mount(
        <Provider store={store}>
            <ConnectedSignUpPage />
        </Provider>,
    );
});

describe('<App />', () => {
    it('Generates App', () => {
        const dispatch = jest.fn();
        const wrapper = shallow(<SignUpPage dispatch={dispatch} />);
        wrapper.find('SignUp').prop('onSignUpClick')('test');
        expect(dispatch.mock.calls.length).toBe(1);
    });
});
