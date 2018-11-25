// @flow
import { Provider } from 'react-redux';
import { mount, shallow } from 'enzyme';
import React from 'react';

import { createAppStore } from './store';
import SignUpPage, { SignUpPageComponent } from './SignUpPage';

const store = createAppStore();

it('renders without crashing', () => {
    mount(
        <Provider store={store}>
            <SignUpPage />
        </Provider>,
    );
});

describe('<App />', () => {
    it('Generates App', () => {
        const dispatch = jest.fn();
        const wrapper = shallow(<SignUpPageComponent dispatch={dispatch} />);
        wrapper.find('SignUp').prop('onSignUpClick')('test');
        expect(dispatch.mock.calls.length).toBe(1);
    });
});
