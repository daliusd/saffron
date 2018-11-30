// @flow
import { mount, shallow } from 'enzyme';
import React from 'react';

import Login from './Login';

describe('<Login />', () => {
    it('Generates Login', () => {
        shallow(<Login onLoginClick={() => {}} errorMessage="oops" />);
    });

    it('simulates click event', () => {
        const onLoginClick = jest.fn();
        const wrapper = mount(<Login onLoginClick={onLoginClick} errorMessage="" />);
        wrapper.find('form').simulate('submit');
        expect(onLoginClick.mock.calls.length).toBe(1);
    });
});
