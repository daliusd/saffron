import { applyMiddleware, compose, createStore, Store } from 'redux';
import createSagaMiddleware from 'redux-saga';

import { rootSaga } from './sagas';
import reducers from './reducers';

export let store: Store | undefined;

export function createAppStore() {
    const sagaMiddleware = createSagaMiddleware();
    store = createStore(
        reducers,
        // @ts-ignore: __REDUX_DEVTOOLS_EXTENSION__ does not exists on window
        window.__REDUX_DEVTOOLS_EXTENSION__
            ? compose(
                  applyMiddleware(sagaMiddleware),
                  // @ts-ignore: __REDUX_DEVTOOLS_EXTENSION__ does not exists on window
                  window.__REDUX_DEVTOOLS_EXTENSION__(),
              )
            : applyMiddleware(sagaMiddleware),
    );
    sagaMiddleware.run(rootSaga);
    return store;
}
