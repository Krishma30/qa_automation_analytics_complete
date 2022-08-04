import * as types from './actionTypes';
import Immutable from 'seamless-immutable';

const initialState = Immutable({
  data: [],
  loading: true
});

export default function(state = initialState, action) {
  switch (action.type) {
    case types.REQUEST_ANALYTICS_RESULTS:
      return state.merge({
        loading: true
      });
    case types.RECEIVE_ANALYTICS_RESULTS:
      return state.merge({
        data: action.payload.data,
        loading: false
      });

    default:
      return state;
  }
}

// selectors

export function getAnalyticsSessions(state) {
  const data = state.analyticsSessions.data
    ? state.analyticsSessions.data.asMutable()
    : null;
  const loading = state.analyticsSessions.loading;
  console.log(data +'--REDUCERS--- '+ loading);
  return {
    loading,
    data
  };
}

// export function getPageLoadValidation(state) {
//   const data = state.PageLoadValidation.data
//     ? state.PageLoadValidation.data.asMutable()
//     : null;
//   const loading = state.PageLoadValidation.loading;
//   return {
//     loading,
//     data
//   };
// } 


