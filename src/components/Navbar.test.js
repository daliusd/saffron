// @flow
import { shallow } from 'enzyme';
import React from 'react';

import { NavbarC } from './Navbar';

describe('<NavbarC />', () => {
    it('Generates NavbarC isAuthenticated=false', () => {
        const wrapper = shallow(<NavbarC isAuthenticated={false} errorMessage="" dispatch={() => {}} />);
        expect(wrapper.find('Login')).toHaveLength(1);
        expect(wrapper.find('Logout')).toHaveLength(0);
    });

    it('Generates NavbarC isAuthenticated=false simulated login click', () => {
        const onLoginClick = jest.fn();
        const wrapper = shallow(<NavbarC isAuthenticated={false} errorMessage="" dispatch={onLoginClick} />);
        wrapper.find('Login').simulate('loginClick');
        expect(onLoginClick.mock.calls.length).toBe(1);
    });

    it('Generates NavbarC isAuthenticated=true', () => {
        const wrapper = shallow(<NavbarC isAuthenticated={true} errorMessage="" dispatch={() => {}} />);
        expect(wrapper.find('Login')).toHaveLength(0);
        expect(wrapper.find('Logout')).toHaveLength(1);
    });

    it('Generates NavbarC isAuthenticated=true simulated logout click', () => {
        const onLogoutClick = jest.fn();
        const wrapper = shallow(<NavbarC isAuthenticated={true} errorMessage="" dispatch={onLogoutClick} />);
        wrapper.find('Logout').simulate('logoutClick');
        expect(onLogoutClick.mock.calls.length).toBe(1);
    });
});
