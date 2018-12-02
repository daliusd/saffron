// @flow
import { shallow } from 'enzyme';
import React from 'react';

import { Navbar } from './Navbar';

describe('<Navbar />', () => {
    it('Generates Navbar isAuthenticated=false', () => {
        const wrapper = shallow(<Navbar isAuthenticated={false} dispatch={() => {}} messages={[]} />);
        expect(wrapper.find('Link')).toHaveLength(3);
        expect(wrapper.find('Logout')).toHaveLength(0);
    });

    it('Generates Navbar isAuthenticated=true', () => {
        const wrapper = shallow(<Navbar isAuthenticated={true} dispatch={() => {}} messages={[]} />);
        expect(wrapper.find('Link')).toHaveLength(1);
        expect(wrapper.find('Logout')).toHaveLength(1);
    });

    it('Generates Navbar isAuthenticated=true simulated logout click', () => {
        const onLogout = jest.fn();
        const wrapper = shallow(<Navbar isAuthenticated={true} dispatch={onLogout} messages={[]} />);
        wrapper.find('Logout').simulate('logout');
        expect(onLogout.mock.calls.length).toBe(1);
    });

    it('Generates Navbar isAuthenticated=false with message', () => {
        const wrapper = shallow(
            <Navbar
                isAuthenticated={false}
                dispatch={() => {}}
                messages={[{ id: '123', type: 'error', text: 'some text' }]}
            />,
        );
        expect(wrapper.find('li')).toHaveLength(1);
    });
});
