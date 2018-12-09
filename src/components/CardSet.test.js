// @flow
import { shallow } from 'enzyme';
import React from 'react';

import configureMockStore from 'redux-mock-store';

import ConnectedCardSet, { CardSet } from './CardSet';

describe('<CardSet />', () => {
    it('Generates ConnectedCardSet', () => {
        const mockStore = configureMockStore();

        const state = {
            auth: {
                isAuthenticated: false,
            },
            cardsets: {
                allIds: [1],
                byId: { '1': { id: 1, name: 'test', data: {} } },
                active: 1,
            },
        };
        const store = mockStore(state);
        const wrapper = shallow(<ConnectedCardSet store={store} />);
        wrapper.dive();
    });

    it('Generates CardSet', () => {
        shallow(
            <CardSet dispatch={jest.fn()} isAuthenticated={true} activeCardSet={{ id: 1, name: 'test', data: {} }} />,
        );
    });

    it('Generates CardSet', () => {
        const dispatch = jest.fn();
        const wrapper = shallow(
            <CardSet dispatch={dispatch} isAuthenticated={true} activeCardSet={{ id: 1, name: 'test', data: {} }} />,
        );
        wrapper.find('button').simulate('click');
        expect(dispatch.mock.calls.length).toBe(1);
    });
});
