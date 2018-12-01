// @flow
import { mount, shallow } from 'enzyme';
import React from 'react';

import { SignUp } from './SignUp';

describe('<SignUp />', () => {
    it('Generates SignUp', () => {
        shallow(<SignUp onSignUpClick={() => {}} dispatch={() => {}} />);
    });

    it('simulates click event. Passwords do not match.', () => {
        const onSignUpClick = jest.fn();
        const dispatch = jest.fn();
        const wrapper = mount(<SignUp onSignUpClick={onSignUpClick} dispatch={dispatch} />);
        wrapper.ref('password').value = 'pass1';
        wrapper.ref('password_repeat').value = 'pass2';
        wrapper.find('form').simulate('submit');
        expect(onSignUpClick.mock.calls.length).toBe(0);
        expect(dispatch.mock.calls.length).toBe(1);
    });

    it('simulates click event. Passwords match.', () => {
        const onSignUpClick = jest.fn();
        const dispatch = jest.fn();
        const wrapper = mount(<SignUp onSignUpClick={onSignUpClick} dispatch={dispatch} />);
        wrapper.ref('password').value = 'pass1';
        wrapper.ref('password_repeat').value = 'pass1';
        wrapper.find('form').simulate('submit');
        expect(onSignUpClick.mock.calls.length).toBe(1);
        expect(dispatch.mock.calls.length).toBe(0);
    });
});
