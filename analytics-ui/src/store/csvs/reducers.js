import * as types from './actionTypes';
import Immutable from 'seamless-immutable';

const initialState = Immutable({
  currentSessionErrors: [],
  currentSessionResponses: [],
  retrieveCsvError: false
});

export default function(state = initialState, action) {
  switch (action.type) {
    case types.RECEIVE_ERRORS_CSV:
      return state.merge({
        currentSessionErrors: action.payload.csvErrorsArray
      });
    case types.RECEIVE_RESPONSES_CSV:
      return state.merge({
        currentSessionResponses: action.payload.csvResponsesArray
      });

    case types.FAILURE_ERRORS_CSV:
    case types.FAILURE_RESPONSES_CSV:
      return state.merge({
        retrieveCsvError: true
      });

    default:
      return state;
  }
}

// selectors

export function getSessionErrors(state) {
  return state.csvs.currentSessionErrors.asMutable();
}

export function getSessionResponses(state) {
  return state.csvs.currentSessionResponses.asMutable();
}

export function getCsvErrorStatus(state) {
  return state.csvs.retrieveCsvError;
}
