// @flow
import { shallow } from 'enzyme';
import React from 'react';

import { Navbar } from './Navbar';

describe('<Navbar />', () => {
    it('Generates Navbar isAuthenticated=false', () => {
        const wrapper = shallow(<Navbar isAuthenticated={false} errorMessage="" dispatch={() => {}} />);
        expect(wrapper.find('Link')).toHaveLength(3);
        expect(wrapper.find('Logout')).toHaveLength(0);
    });

    it('Generates Navbar isAuthenticated=true', () => {
        const wrapper = shallow(<Navbar isAuthenticated={true} errorMessage="" dispatch={() => {}} />);
        expect(wrapper.find('Link')).toHaveLength(1);
        expect(wrapper.find('Logout')).toHaveLength(1);
    });

    it('Generates Navbar isAuthenticated=true simulated logout click', () => {
        const onLogoutClick = jest.fn();
        const wrapper = shallow(<Navbar isAuthenticated={true} errorMessage="" dispatch={onLogoutClick} />);
        wrapper.find('Logout').simulate('logoutClick');
        expect(onLogoutClick.mock.calls.length).toBe(1);
    });
});
