import React from 'react';
import { shallow } from 'enzyme';
import Logout from './Logout';

describe('<Logout />', () => {
    it('Generates logout', () => {
        const wrapper = shallow(<Logout />);
        expect(wrapper.find('button')).toHaveLength(1);
    });

    it('simulates click event', () => {
        const onButtonClick = jest.fn();
        const wrapper = shallow(<Logout onLogoutClick={onButtonClick} />);
        wrapper.find('button').simulate('click');
        expect(onButtonClick.mock.calls.length).toBe(1);
    });
});
