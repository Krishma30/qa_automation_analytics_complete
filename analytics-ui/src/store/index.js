import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import * as reducers from './reducers';

const loggerMiddleware = createLogger();

export default function configureStore(preloadedState) {
  return createStore(
    combineReducers(reducers),
    preloadedState,
    applyMiddleware(thunkMiddleware, loggerMiddleware)
  );
}
