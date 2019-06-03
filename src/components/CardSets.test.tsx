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
            <CardSets
                dispatch={jest.fn()}
                isAuthenticated={true}
                allIds={[]}
                byId={{}}
                activeGame={null}
                isCreatingPng={false}
            />,
        );
        expect(wrapper.find('button')).toHaveLength(0);
    });

    it('Generates CardSets with some info', () => {
        const wrapper = shallow(
            <CardSets
                dispatch={jest.fn()}
                isAuthenticated={true}
                allIds={['1']}
                byId={{ '1': { id: '1', name: 'test' } }}
                activeGame={{ id: '1', name: 'test' }}
                isCreatingPng={false}
            />,
        );
        expect(wrapper.find('button')).toHaveLength(2);
    });

    it('simulates create click event', () => {
        const cardsetCreate = jest.fn();
        const wrapper = shallow(
            <CardSets dispatch={cardsetCreate} isAuthenticated={true} allIds={[]} byId={{}} activeGame={'1'} />,
        );
        wrapper
            .find('button')
            .first()
            .simulate('click');
        expect(cardsetCreate.mock.calls.length).toBe(1);
    });
});
