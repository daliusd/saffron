// @flow
import { createAppStore } from './store';

it('renders without crashing', () => {
    const ext = jest.fn(getState => next => action => next(action));
    window.__REDUX_DEVTOOLS_EXTENSION__ = ext;

    createAppStore();
    expect(ext.mock.calls.length).toBe(1);
});
