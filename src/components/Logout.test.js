// @flow
import React from 'react';
import { shallow } from 'enzyme';
import Logout from './Logout';

describe('<Logout />', () => {
    it('Generates logout', () => {
        const wrapper = shallow(<Logout onLogout={() => {}} />);
        expect(wrapper.find('button')).toHaveLength(1);
    });

    it('simulates click event', () => {
        const onLogout = jest.fn();
        const wrapper = shallow(<Logout onLogout={onLogout} />);
        wrapper.find('button').simulate('click');
        expect(onLogout.mock.calls.length).toBe(1);
    });
});
