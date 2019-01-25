import { createAppStore } from './store';

it('renders without crashing', () => {
    const ext = jest.fn((/* getState */) => (next: (action: () => void) => void) => (action: () => void) =>
        next(action),
    );
    // @ts-ignore: __REDUX_DEVTOOLS_EXTENSION__ does not exists on window
    window.__REDUX_DEVTOOLS_EXTENSION__ = ext;

    createAppStore();
    expect(ext.mock.calls.length).toBe(1);
});
