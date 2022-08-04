import * as types from './actionTypes';
import { getCSVResultsPath } from '../../helpers/pathHelpers';
const csvjson = require('csvjson');

// const ERRORS_HEADERS = ['url', 'shortError', 'longError'];
// const RESPONSE_HEADERS = [
//   'url',
//   'viewport',
//   'loadTime',
//   'statusCode',
//   'diffPercentage'
// ];

function requestErrorsCsv() {
  return {
    type: types.REQUEST_ERRORS_CSV
  };
}



function receiveErrorsCsv(csvErrorsArray) {
  return {
    type: types.RECEIVE_ERRORS_CSV,
    payload: {
      csvErrorsArray
     
    }
  };
}

export function fetchErrorsCsv(sessionId) {
  return async dispatch => {
    try {
      dispatch(requestErrorsCsv());
      const csvPath = getCSVResultsPath('errors.csv', sessionId);

      const csvFile = await fetch(csvPath);

      if (csvFile.status !== 200) {
        throw new Error('Error geting csv file');
      }
      const csvFileText = await csvFile.text();
    
      const options = {
        headers: 'url,shortError,longError'
      };
      let csvErrorsArray = csvjson.toObject(csvFileText, options);

      
      
      csvErrorsArray.shift();
      dispatch(receiveErrorsCsv(csvErrorsArray));
    } catch (error) {
      throw new Error(error);
      //dispatch(failureErrorsCsv(`Error getting CSV ${error}`));
    }
  };
}


