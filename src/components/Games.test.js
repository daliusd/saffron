// @flow
import { mount, shallow } from 'enzyme';
import React from 'react';

import Games from './Games';

describe('<Games />', () => {
    it('Generates Games', () => {
        const wrapper = shallow(<Games onGameCreate={() => {}} isAuthenticated={true} gamelist={[]} />);
        expect(wrapper.find('button')).toHaveLength(1);
    });

    it('Generates Games', () => {
        const wrapper = shallow(
            <Games onGameCreate={() => {}} isAuthenticated={true} gamelist={[{ id: 1, name: 'test', data: '' }]} />,
        );
        expect(wrapper.find('button')).toHaveLength(1);
    });

    it('simulates click event', () => {
        const gameCreate = jest.fn();
        const wrapper = mount(<Games onGameCreate={gameCreate} isAuthenticated={true} gamelist={[]} />);
        wrapper.find('button').simulate('click');
        expect(gameCreate.mock.calls.length).toBe(1);
    });
});
