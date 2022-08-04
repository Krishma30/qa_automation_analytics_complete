'use strict';
const dbHelper = require('./modules/dbhelper');
const adobeValidation = require('./modules/adobevalidation');
const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};

module.exports.startAnalyticsSession = (event, context, callback) => {
  
  const postData = JSON.parse(event.body);
  const sessionId = postData.sessionId;
  const siteName = postData.siteName;
  const numberOfPages = postData.numberOfPages;

  // const response = {
  //   statusCode: 200,
  //   body: JSON.stringify({
  //     message: 'startAnalyticsSession',
  //     input: event,
  //   }),
  // };

  // callback(null, response);
 
  dbHelper.startSession(sessionId, siteName, numberOfPages)
    .then((data) => {
      const okResponse = {
        headers: corsHeaders,
        statusCode: 200,
        body: JSON.stringify({
          started: true,
        }),
      };
      callback(null, okResponse);
    })
    .catch(err => {
      console.error(err);
      const errorResponse = {
        statusCode: 500,
        body: err,
      };
      callback(null, errorResponse);
    });

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};

module.exports.endSession = (event, context, callback) => {
  const postData = JSON.parse(event.body);
  const sessionId = postData.sessionId;
  const duration = postData.duration;
  const results = postData.results;
  dbHelper.endSession(sessionId, duration, results)
    .then((data) => {
      const okResponse = {
        headers: corsHeaders,
        statusCode: 200,
        body: JSON.stringify({
          started: true,
        }),
      };
      callback(null, okResponse);
    })
    .catch((err) => {
      console.log(err);
      const errorResponse = {
        statusCode: 500,
        body: err,
      };
      callback(null, errorResponse);
    });
};

module.exports.getTestSessions = (event, context, callback) => {
  dbHelper.getTestSessions(false)
    .then((data) => {
      callback(null, {
        headers: corsHeaders,
        statusCode: 200,
        body: JSON.stringify(data),
      });
    })
    .catch((err) => {
      console.error(err);
      const errorResponse = {
        statusCode: 500,
        body: err,
      };
      callback(null, errorResponse);
    });
};

module.exports.updateCounter = (event, context, callback) => {
  const postData = JSON.parse(event.body);
  const sessionId = postData.sessionId;
  const passed = postData.passed;

  dbHelper.updateCounter(sessionId, passed)
    .then((data) => {
      callback(null, {
        headers: corsHeaders,
        statusCode: 200,
        body: JSON.stringify(data),
      });
    })
    .catch((err) => {
      console.error(err);
      const errorResponse = {
        statusCode: 500,
        body: err,
      };
      callback(null, errorResponse);
    });
};

module.exports.startAdobeValidation = (event, context, callback) => {
  console.log("events",event);
  console.log("context",context);
  let postData = JSON.parse(event.body);
  let type = postData.type;
  let queryString = postData.queryString;
  let batchResultsSummary = postData.batchResultsSummary;
  let currentSessionId = batchResultsSummary.sessionId;  
  let url = postData.url;
  var  clickValidationResponse;  

  if(queryString.events==null){ 
    clickValidationResponse= ' No event found in the query String '; 
    dbHelper.insertValidationData(type,currentSessionId,batchResultsSummary.siteName, url,'', '','','failed',clickValidationResponse)    
      .then((data)=>{
        callback(null,{
          headers: corsHeaders,
          statusCode: 200,
          body: JSON.stringify(data),
        });
      })
      .catch((err) => {
        console.error(err);
        const errorResponse = {
          statusCode: 500,
          body: err,
        };
        callback(null, errorResponse);
      });    
  }else{
    adobeValidation.checkforAdobeEvents(postData)
    .then((data)=>{
        callback(null,{
          headers: corsHeaders,
          statusCode: 200,
          body: JSON.stringify(data),
        });
    })
    .catch((err) => {
      console.error(err);
      const errorResponse = {
        statusCode: 500,
        body: err,
      };
      callback(null, errorResponse);
    });
  }  
}

module.exports.getAdobeValidation = (event, context, callback) => {
  dbHelper.getValidationData(false)
    .then((data) => {
      callback(null, {
        headers: corsHeaders,
        statusCode: 200,
        body: JSON.stringify(data),
      });
    })
    .catch((err) => {
      console.error(err);
      const errorResponse = {
        statusCode: 500,
        body: err,
      };
      callback(null, errorResponse);
    });
};

module.exports.getPageLoadValidation = (event, context, callback) => {
  dbHelper.getPageLoadData(false)
    .then((data) => {
      callback(null, {
        headers: corsHeaders,
        statusCode: 200,
        body: JSON.stringify(data),
      });
    })
    .catch((err) => {
      console.error(err);
      const errorResponse = {
        statusCode: 500,
        body: err,
      };
      callback(null, errorResponse);
    });
};

module.exports.startAnalyticsTest = (event, context, callback) => {
  console.log("events",event);
  console.log("context",context);
  let postData = JSON.parse(event.body);  
  dbHelper.insertAnalyticsData(postData)
    .then((data)=>{
      callback(null,{
        headers: corsHeaders,
        statusCode: 200,
        body: JSON.stringify(data),
      });
  })
  .catch((err) => {
    console.error(err);
    const errorResponse = {
      statusCode: 500,
      body: err,
    };
    callback(null, errorResponse);
  }); 
};

//triggerExecution
module.exports.triggerAnalyticsExecution = (event, context, callback) => {
  const postData = JSON.parse(event.body);
  console.log("Inside handler Js " );
  console.log("Inside handler Js event" + event);
  console.log("Inside handler Js  context" + context);
  console.log("Inside handler Js postData " + postData);

  dbHelper.triggerAnalyticsExecution(postData)
    .then((data) => {
      callback(null, {
        headers: corsHeaders,
        statusCode: 200,
        body: JSON.stringify(data),
      });
    })
    .catch((err) => {
      console.error(err);
      const errorResponse = {
        statusCode: 500,
        body: err,
      };
      callback(null, errorResponse);
    });
};


module.exports.getPageInfo = async (event, context, callback) => {
  console.log("events ");
  console.log(JSON.stringify(event));

  // let postData = JSON.parse(event.body);
  // console.log(postData);
  let url = event.queryStringParameters.url;
  console.log(url)
  dbHelper.getPageInfo(url)
    .then((data) => {
      callback(null, {
        headers: corsHeaders,
        statusCode: 200,
        body: JSON.stringify(data),
      });
    })
    .catch((err) => {
      console.error(err);
      const errorResponse = {
        statusCode: 500,
        body: err,
      };
      callback(null, errorResponse);
    });
};
