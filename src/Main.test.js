// @flow
import { Provider } from 'react-redux';
import { mount, shallow } from 'enzyme';
import React from 'react';

import { createAppStore } from './store';
import Main, { MainComponent } from './Main';

const store = createAppStore();

it('renders without crashing', () => {
    mount(
        <Provider store={store}>
            <Main />
        </Provider>,
    );
});

describe('<App />', () => {
    it('Generates App', () => {
        const dispatch = jest.fn();
        const wrapper = shallow(<MainComponent isAuthenticated={true} gamelist={[]} dispatch={dispatch} />);
        wrapper.find('Games').prop('onGameCreate')('test');
        expect(dispatch.mock.calls.length).toBe(2);
    });
});
