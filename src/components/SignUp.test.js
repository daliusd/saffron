// @flow
import { mount, shallow } from 'enzyme';
import React from 'react';

import SignUp from './SignUp';

describe('<SignUp />', () => {
    it('Generates SignUp', () => {
        const wrapper = shallow(<SignUp onSignUpClick={() => {}} errorMessage="oops" />);
        expect(wrapper.find('button')).toHaveLength(1);
    });

    it('simulates click event. Passwords do not match.', () => {
        const onButtonClick = jest.fn();
        const wrapper = mount(<SignUp onSignUpClick={onButtonClick} errorMessage="" />);
        wrapper.ref('password').value = 'pass1';
        wrapper.ref('password_repeat').value = 'pass2';
        wrapper.find('button').simulate('click');
        expect(onButtonClick.mock.calls.length).toBe(0);
        expect(wrapper.state('errorMessage')).toEqual('Passwords do not match.');
    });

    it('simulates click event. Passwords match.', () => {
        const onButtonClick = jest.fn();
        const wrapper = mount(<SignUp onSignUpClick={onButtonClick} errorMessage="" />);
        wrapper.ref('password').value = 'pass1';
        wrapper.ref('password_repeat').value = 'pass1';
        wrapper.find('button').simulate('click');
        expect(onButtonClick.mock.calls.length).toBe(1);
        expect(wrapper.state('errorMessage')).toEqual('');
    });
});
