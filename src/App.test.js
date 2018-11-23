// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import App, { AppComponent } from './App';
import { createAppStore } from './store';
import { Provider } from 'react-redux';
import { shallow } from 'enzyme';

const store = createAppStore();

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>,
        div,
    );
    ReactDOM.unmountComponentAtNode(div);
});

describe('<App />', () => {
    it('Generates App', () => {
        const dispatch = jest.fn();
        const wrapper = shallow(<AppComponent isAuthenticated={true} gamelist={[]} dispatch={dispatch} />);
        wrapper.find('Games').prop('onGameCreate')('test');
        expect(dispatch.mock.calls.length).toBe(2);
    });
});
