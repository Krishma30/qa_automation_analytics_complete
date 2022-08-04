import * as types from './actionTypes';
import Immutable from 'seamless-immutable';

const initialState = Immutable({
  data: [],
  loading: true
});

export default function(state = initialState, action) {
  switch (action.type) {
    case types.REQUEST_BEFORE_RESULTS:
      return state.merge({
        loading: true
      });
    case types.RECEIVE_BEFORE_RESULTS:
      return state.merge({
        data: action.payload.data,
        loading: false
      });

    default:
      return state;
  }
}

// selectors

export function getBeforeSessions(state) {
  const data = state.beforeSessions.data
    ? state.beforeSessions.data.asMutable()
    : null;
  const loading = state.beforeSessions.loading;
  return {
    loading,
    data
  };
}
