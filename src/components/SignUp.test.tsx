import { mount, shallow } from 'enzyme';
import React from 'react';

import { SignUp } from './SignUp';

describe('<SignUp />', () => {
    it('Generates SignUp', () => {
        shallow(<SignUp onSignUp={() => {}} dispatch={a => a} />);
    });

    it('simulates click event. Passwords do not match.', () => {
        const onSignUp = jest.fn();
        const dispatch = jest.fn();
        const wrapper = mount(<SignUp onSignUp={onSignUp} dispatch={dispatch} />);
        wrapper.setState({
            password: 'pass1',
            passwordRepeat: 'pass2',
        });
        wrapper.find('form').simulate('submit');
        expect(onSignUp.mock.calls.length).toBe(0);
        expect(dispatch.mock.calls.length).toBe(1);
    });

    it('simulates click event. Passwords match.', () => {
        const onSignUp = jest.fn();
        const dispatch = jest.fn();
        const wrapper = mount(<SignUp onSignUp={onSignUp} dispatch={dispatch} />);
        wrapper.setState({
            password: 'pass1',
            passwordRepeat: 'pass1',
        });
        wrapper.find('form').simulate('submit');
        expect(onSignUp.mock.calls.length).toBe(1);
        expect(dispatch.mock.calls.length).toBe(0);
    });
});
