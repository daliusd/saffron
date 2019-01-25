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
        const wrapper = shallow(<SignUpPage dispatch={dispatch} isAuthenticated={false} />);
        expect(wrapper.find('Connect(SignUp)')).toHaveLength(1);
        wrapper.find('Connect(SignUp)').simulate('signUp', 'test');
        expect(dispatch.mock.calls.length).toBe(1);
    });

    it('redirects to / if authenticated', () => {
        const dispatch = jest.fn();
        const wrapper = shallow(<SignUpPage dispatch={dispatch} isAuthenticated={true} />);
        expect(wrapper.find('SignUp')).toHaveLength(0);
        expect(wrapper.find('Redirect')).toHaveLength(1);
    });
});
