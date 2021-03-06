import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import React from 'react';

import configureMockStore from 'redux-mock-store';

import { DefaultAuthState, DefaultCardSetState, DefaultState, State } from '../reducers';
import ConnectedCardSet, { CardSet } from './CardSet';

describe('<CardSet />', () => {
    it('Generates ConnectedCardSet', () => {
        const mockStore = configureMockStore();

        const state: State = {
            ...DefaultState,
            auth: {
                ...DefaultAuthState,
                isAuthenticated: false,
            },
            cardsets: {
                ...DefaultCardSetState,
                allIds: ['1'],
                byId: { '1': { id: '1', name: 'test' } },
                active: '1',
            },
        };
        const store = mockStore(state);
        mount(
            <Provider store={store}>
                <ConnectedCardSet />
            </Provider>,
        );
    });

    it('Generates CardSet', () => {
        shallow(
            <CardSet
                dispatch={jest.fn()}
                isAuthenticated={true}
                cardsAllIds={['1']}
                cardsById={{ '1': { id: '1', name: 'test', count: 1 } }}
                activeCardSet={null}
            />,
        );
    });

    it('Generates CardSet', () => {
        const dispatch = jest.fn();
        const wrapper = shallow(
            <CardSet
                dispatch={dispatch}
                isAuthenticated={true}
                cardsAllIds={['1']}
                cardsById={{ '1': { id: '1', name: 'test', count: 1 } }}
                activeCardSet={null}
            />,
        );
        wrapper
            .find('div#newCard')
            .first()
            .simulate('click');
        expect(dispatch.mock.calls.length).toBe(1);
    });

    it('Generates CardSet with cards', () => {
        const dispatch = jest.fn();
        const wrapper = shallow(
            <CardSet
                dispatch={dispatch}
                isAuthenticated={true}
                cardsAllIds={['1']}
                cardsById={{ '1': { id: '1', name: 'test', count: 1 } }}
                activeCardSet={null}
            />,
        );
        wrapper
            .find('div#newCard')
            .first()
            .simulate('click');
        expect(dispatch.mock.calls.length).toBe(1);
    });
});
