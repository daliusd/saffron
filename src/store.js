import { createStore, applyMiddleware } from 'redux';
import quotesApp from './reducers';
import createSagaMiddleware from 'redux-saga';
import { rootSaga } from './sagas';

export function createAppStore() {
    const sagaMiddleware = createSagaMiddleware();
    const store = createStore(quotesApp, applyMiddleware(sagaMiddleware));
    sagaMiddleware.run(rootSaga);
    return store;
}
