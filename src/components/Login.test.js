// @flow
import { mount, shallow } from 'enzyme';
import React from 'react';

import Login from './Login';

describe('<Login />', () => {
    it('Generates Login', () => {
        const wrapper = shallow(<Login onLoginClick={() => {}} errorMessage="" />);
        expect(wrapper.find('button')).toHaveLength(1);
    });

    it('simulates click event', () => {
        const onButtonClick = jest.fn();
        const wrapper = mount(<Login onLoginClick={onButtonClick} errorMessage="" />);
        wrapper.find('button').simulate('click');
        expect(onButtonClick.mock.calls.length).toBe(1);
    });
});
