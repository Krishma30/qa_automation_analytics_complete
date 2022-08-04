'use strict';

var uuidv4  = require('uuid/v4');
//Insert data for pageload validation table - qa-analytics-analyticstest-v2-beta
class AnalyticsTestTable {
  constructor(tableName, db, docClient) {
    this.tableName = tableName;
    this.db = db;
    this.docClient = docClient;
  }

  insertAnalyticsTestData(data) {
   // console.log("insertAnalyticsTestData called");
    //console.log("insertAnalyticsTestData data",data);
    const docClient = this.docClient;
    let uuid= uuidv4();
    console.log("insertValidationData uuid",uuid);
    const date = new Date().toISOString();
    const params = {
      TableName: this.tableName,
      Item: {
        Id:uuid,
        type:data.type,
        date: date,
        url:data.url,
        status:data.status,
        reason:data.reason,
        analyticsType: data.analyticsType, 
        siteName: data.batchResultsSummary.siteName,
        sessionId: data.batchResultsSummary.sessionId   
      },
    };
    return new Promise((resolve, reject) => {
      docClient.put(params, (err, data) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

   //Retrieve data for Page load validation table - qa-analytics-analyticstest-v2-beta  
   getPageLoadAnalyticsData() {
    const docClient = this.docClient;
    console.log()
    const projectionExpression = `Id, sessionId, siteName,#date, #status , #type,#url,reason, analyticsType`;
  
    const params = {
      TableName: this.tableName,
      ProjectionExpression: projectionExpression,
      ExpressionAttributeNames: {
        '#date': 'date',
        '#status': 'status',
        '#type':'type',
        '#url':'url',
      },
    };
    return new Promise((resolve, reject) => {
      docClient.scan(params, (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(data.Items);
        }
      });
    });
  } 
 

}
module.exports = AnalyticsTestTable;