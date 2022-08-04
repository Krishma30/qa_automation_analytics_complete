import * as types from './actionTypes';
const API_ENDPOINT = process.env.REACT_APP_TESTING_API_ENDPOINT ;
const ANALYTICS_API_PATH = `${API_ENDPOINT}/getAdobeValidation`; // get data from events table
const PAGELOAD_API_PATH = `${API_ENDPOINT}/getPageLoadValidation`; // get data from page load
// <<<<<<< HEAD
// <<<<<<< HEAD

// =======
// >>>>>>> da92394b636cc50f0ff5a17e0d6f4c6570de1efe
// =======
// >>>>>>> da92394b636cc50f0ff5a17e0d6f4c6570de1efe

function requestAnalyticsSessions() {

  return {
    type: types.REQUEST_ANALYTICS_RESULTS
  };
}

function receiveAnalyticsSessions(data) {
  return {
    type: types.RECEIVE_ANALYTICS_RESULTS,
    payload: {
      data
    }
  };
}

function failureAnalyticsSessions(errorMessage) {
  return {
    type: types.RECEIVE_ANALYTICS_RESULTS,
    payload: {
      errorMessage
    }
  };
}

export function fetchPageLoad() {
  return async dispatch => {
    try {
      dispatch(requestAnalyticsSessions());
      const pageSessionsData = await fetch(PAGELOAD_API_PATH);
      
      const pageSessionsDataJson = await pageSessionsData.json();

      pageSessionsDataJson.sort((a, b) => new Date(b.date) - new Date(a.date));

      dispatch(receiveAnalyticsSessions(pageSessionsDataJson));
     // console.log();
           //console.table(pageSessionsDataJson);
    } catch (error) {
      dispatch(
        failureAnalyticsSessions(`Error getting analytics sessions ${error.message}`)
      );  
    }
  };
}
