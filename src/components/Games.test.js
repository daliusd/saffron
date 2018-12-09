// @flow
import { mount, shallow } from 'enzyme';
import React from 'react';

import { Games } from './Games';

describe('<Games />', () => {
    it('Generates Games', () => {
        const wrapper = shallow(<Games dispatch={jest.fn()} isAuthenticated={true} allIds={[]} byId={{}} />);
        expect(wrapper.find('button')).toHaveLength(1);
    });

    it('Generates Games with some info', () => {
        const wrapper = shallow(
            <Games dispatch={jest.fn()} isAuthenticated={true} allIds={[1]} byId={{ '1': { id: 1, name: 'test' } }} />,
        );
        expect(wrapper.find('button')).toHaveLength(1);
    });

    it('simulates create click event', () => {
        const gameCreate = jest.fn();
        const wrapper = mount(<Games dispatch={gameCreate} isAuthenticated={true} allIds={[]} byId={{}} />);
        wrapper.find('button').simulate('click');
        expect(gameCreate.mock.calls.length).toBe(1);
    });
});
