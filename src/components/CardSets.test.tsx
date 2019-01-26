import { Provider } from 'react-redux';
import { mount, shallow } from 'enzyme';
import React from 'react';

import configureMockStore from 'redux-mock-store';

import ConnectedCardSets, { CardSets } from './CardSets';

describe('<CardSets />', () => {
    it('Generates ConnectedCardSets', () => {
        const mockStore = configureMockStore();

        const state = {
            auth: {
                isAuthenticated: false,
            },
            games: {
                active: null,
            },
            cardsets: {
                allIds: [],
                byId: {},
            },
        };
        const store = mockStore(state);
        mount(
            <Provider store={store}>
                <ConnectedCardSets />
            </Provider>,
        );
    });

    it('Generates CardSets', () => {
        const wrapper = shallow(
            <CardSets dispatch={jest.fn()} isAuthenticated={true} allIds={[]} byId={{}} activeGame={'1'} />,
        );
        expect(wrapper.find('button')).toHaveLength(1);
    });

    it('Generates CardSets with some info', () => {
        const wrapper = shallow(
            <CardSets
                dispatch={jest.fn()}
                isAuthenticated={true}
                allIds={['1']}
                byId={{ '1': { id: '1', name: 'test' } }}
                activeGame={'1'}
            />,
        );
        expect(wrapper.find('button')).toHaveLength(1);
    });

    it('simulates create click event', () => {
        const cardsetCreate = jest.fn();
        const wrapper = mount(
            <CardSets dispatch={cardsetCreate} isAuthenticated={true} allIds={[]} byId={{}} activeGame={'1'} />,
        );
        wrapper.find('button').simulate('click');
        expect(cardsetCreate.mock.calls.length).toBe(1);
    });
});
