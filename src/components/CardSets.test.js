// @flow
import { mount, shallow } from 'enzyme';
import React from 'react';

import { CardSets } from './CardSets';

describe('<CardSets />', () => {
    it('Generates CardSets', () => {
        const wrapper = shallow(
            <CardSets dispatch={jest.fn()} isAuthenticated={true} allIds={[]} byId={{}} activeGame={1} />,
        );
        expect(wrapper.find('button')).toHaveLength(1);
    });

    it('Generates CardSets with some info', () => {
        const wrapper = shallow(
            <CardSets
                dispatch={jest.fn()}
                isAuthenticated={true}
                allIds={[1]}
                byId={{ '1': { id: 1, name: 'test' } }}
                activeGame={1}
            />,
        );
        expect(wrapper.find('button')).toHaveLength(1);
    });

    it('simulates create click event', () => {
        const cardsetCreate = jest.fn();
        const wrapper = mount(
            <CardSets dispatch={cardsetCreate} isAuthenticated={true} allIds={[]} byId={{}} activeGame={1} />,
        );
        wrapper.find('button').simulate('click');
        expect(cardsetCreate.mock.calls.length).toBe(1);
    });

    it('simulates select cardset event', () => {
        const cardsetCreate = jest.fn();
        const wrapper = mount(
            <CardSets
                dispatch={cardsetCreate}
                isAuthenticated={true}
                allIds={[1]}
                byId={{ '1': { id: 1, name: 'test' } }}
                activeGame={1}
            />,
        );
        wrapper.find('li').simulate('click');
        expect(cardsetCreate.mock.calls.length).toBe(1);
    });
});
