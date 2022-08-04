const logger = require('../helpers/logger');


const Json2csvParser = require('json2csv').Parser;
const fs = require('fs-extra');

function getValuesForKey(json, key) {
  
  //  console.log('get values for key', key);
    let res = json.profiles.find(i => i.key === key);
    //console.log(res);
    if (!res) {
      return null;
    }
    return {
      values: res.values
    };
  }

  function getValidatiosnForKey(json, name) {
    console.log('get validation for key', name);
    let res = json.values.find(i => i.name === name);
    //console.log(res);
    if (!res) {
      return null;
    }
    return {
        type: res.validationtype,
        value: res.validationvalue
    };
  }

  function writeResultsToCSV(data, sessionId, batchId) {
    console.log("called  writeResultsToCSV"+ sessionId);
    
    

    const fields = ["brand", "markersList", "counter","details"];
    const opts = { fields, unwind: "details" };
    console.log(data);

    try{
      data[batchId].markersList = data[batchId].markersList.join(':');
    }catch(e){
      //ignore
    }

    

   

  
    try {
      var parser = new Json2csvParser(opts);
      var csv = parser.parse(data[batchId]);
     // console.log(csv);
     // require('fs').writeFileSync('./test.csv',JSON.stringify(csv,null,2));

      fs.writeFileSync('./results/'+sessionId+'.csv', csv);
    } catch (err) {
      console.error(err);
    }
  
  }



  function writeErrorMessage(validationType, url, batchResultsSummary, errorMessage) {
    const errorMessageParts = errorMessage.toString().split('\n');
    let shortError = '';
    if (errorMessageParts.length > 0) {
      shortError = errorMessageParts[0];
    }
    batchResultsSummary.errors.push({
      validationType,
      url,
      shortError: shortError,
      error: errorMessage.toString(),
    });
    logger.divide();
    logger.error(`** FAIL: ${validationType} |  ${url} | ${errorMessage}`);
    logger.divide();
  }

  function getAnalyticsURLForLocale(analyticsConfig, country) {
    let res = analyticsConfig.profiles.find(i => i.country === country);
    if (!res) {
      return null;
    }
    return {
      url: res.url,
    };
  }

  module.exports = {
    getValuesForKey,
    getValidatiosnForKey,
    writeErrorMessage,
    getAnalyticsURLForLocale,
    writeResultsToCSV,
  };