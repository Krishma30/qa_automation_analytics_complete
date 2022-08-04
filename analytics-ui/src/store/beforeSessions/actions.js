import * as types from './actionTypes';
const API_ENDPOINT = process.env.REACT_APP_TESTING_API_ENDPOINT ;
const BEFORE_API_PATH = `${API_ENDPOINT}/getAdobeValidation`;

function requestBeforeSessions() {

  return {
    type: types.REQUEST_BEFORE_RESULTS
  };
}

function receiveBeforeSessions(data) {
  return {
    type: types.RECEIVE_BEFORE_RESULTS,
    payload: {
      data
    }
  };
}

function failureBeforeSessions(errorMessage) {
  return {
    type: types.RECEIVE_BEFORE_RESULTS,
    payload: {
      errorMessage
    }
  };
}

export function fetchBeforeSessions() {
  return async dispatch => {
    try {
      dispatch(requestBeforeSessions());
      const beforeSessions = await fetch(BEFORE_API_PATH);
      
      const beforeSessionsJson = await beforeSessions.json();

      beforeSessionsJson.sort((a, b) => new Date(b.date) - new Date(a.date));

      dispatch(receiveBeforeSessions(beforeSessionsJson));
    } catch (error) {
      dispatch(
        failureBeforeSessions(`Error getting before sessions ${error.message}`)
      );
    }
  };
}
