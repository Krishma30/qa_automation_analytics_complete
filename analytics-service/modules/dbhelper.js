'use strict';
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();


const SessionsTable = require('./sessionTable');
const AdobevalidationTable = require('./adobeValidationTable');
const analyticsTestvalidationTable = require('./analyticsTestValidationTable');
const pageObject = require('./getPageObjects');
const SendMessageSQS = require('./sendMessageToSQS');

const {
  URL_TRIGGER_SQS
} = process.env

let docClient = null;
if (process.env.IS_OFFLINE === 'false') {
  docClient = new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
    convertEmptyValues : true 
  });
  console.log(docClient);
} else {
  docClient = new AWS.DynamoDB.DocumentClient({convertEmptyValues : true });

}

const SessionsTableSession = new SessionsTable('qa-analytics-sessions-v2-beta', dynamodb, docClient);
const AdobevalidationTableObj = new AdobevalidationTable('qa-analytics-validationevents-v2-beta', dynamodb, docClient);
const analyticsTestvalidationTableObj = new analyticsTestvalidationTable('qa-analytics-pageload-v3-beta', dynamodb, docClient);


module.exports.startSession = (sessionId, siteName, numberOfPages) => {
    return SessionsTableSession.startSession(sessionId, siteName, numberOfPages);
  };

  module.exports.endSession = (sessionId, duration, results) => {
    return SessionsTableSession.endSession(sessionId, duration, results);
  };

  module.exports.getTestSessions = (sessionId, duration, results) => {
    return SessionsTableSession.getTestSessions(sessionId, duration, results);
  };

  
  module.exports.updateCounter = (sessionId, passed) => {
    return SessionsTableSession.updateCounter(sessionId, passed);
  };
// Insert analytics data for Events - qa-analytics-validationevents-v2-beta
  module.exports.insertValidationData = (type,sessionId,siteName,url,event, eventType,eventValue,status,failureReason)=>{
    return AdobevalidationTableObj.insertValidationData(type,sessionId,siteName,url,event, eventType,eventValue,status,failureReason);
  }
// Get analytics data for Events
  module.exports.getValidationData  = (sessionId, results) => {
    return AdobevalidationTableObj.getValidationTestData(sessionId, results);
  };
// Insert analytics data for PageLoad
  module.exports.insertAnalyticsData = (data)=>{
    return analyticsTestvalidationTableObj.insertAnalyticsTestData(data);
  }

  // Get analytics data for PageLoad
  module.exports.getPageLoadData  = (Id, results) => {
    return analyticsTestvalidationTableObj.getPageLoadAnalyticsData(Id, results);
  };

  module.exports.triggerAnalyticsExecution = async (postData) => {
    console.log("Inside triggerAnalyticsExecution");
    console.log(postData);
    const triggerSQS =  new SendMessageSQS(URL_TRIGGER_SQS);
    return await triggerSQS.sendMessageToSQS(postData)
      .then(async (data) => {
         console.log(`message successfully submitted to SQS : ${data}`)
         return data;
      })
      .catch(async (err) => {
        console.log(`error in submitting message to SQS : ${err}`)
        return null;
      });
  };

    // Get analytics data for PageLoad
    module.exports.getPageInfo  = async (url) => {
      return await pageObject.getPageInfo(url);
      //return 'ss';
    };
