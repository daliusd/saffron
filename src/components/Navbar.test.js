// @flow
import { shallow } from 'enzyme';
import React from 'react';

import { Navbar } from './Navbar';

describe('<Navbar />', () => {
    it('Generates Navbar isAuthenticated=false', () => {
        const wrapper = shallow(<Navbar isAuthenticated={false} dispatch={() => {}} messages={[]} activeGame={null} />);
        expect(wrapper.find('Link')).toHaveLength(3);
        expect(wrapper.find('Logout')).toHaveLength(0);
    });

    it('Generates Navbar isAuthenticated=true', () => {
        const wrapper = shallow(<Navbar isAuthenticated={true} dispatch={() => {}} messages={[]} activeGame={null} />);
        expect(wrapper.find('Link')).toHaveLength(2);
        expect(wrapper.find('Logout')).toHaveLength(1);
    });

    it('Generates Navbar isAuthenticated=true simulated logout click', () => {
        const onLogout = jest.fn();
        const wrapper = shallow(<Navbar isAuthenticated={true} dispatch={onLogout} messages={[]} activeGame={null} />);
        wrapper.find('Logout').simulate('logout');
        expect(onLogout.mock.calls.length).toBe(1);
    });

    it('Generates Navbar isAuthenticated=false with message', () => {
        const wrapper = shallow(
            <Navbar
                isAuthenticated={false}
                dispatch={() => {}}
                messages={[{ id: '123', type: 'error', text: 'some text' }]}
                activeGame={null}
            />,
        );
        expect(wrapper.find('li')).toHaveLength(1);
    });

    it('Generates Navbar isAuthenticated=true simulated logout click with Game Link', () => {
        shallow(
            <Navbar isAuthenticated={true} dispatch={jest.fn()} messages={[]} activeGame={{ id: 1, name: 'test' }} />,
        );
    });
});
