'use strict';

var uuidv4  = require('uuid/v4');
const helper = require('./adobevalidation');

//Insert data for Events validation table - qa-analytics-validationevents-v2-beta
class AdobeValidationTable {
  constructor(tableName, db, docClient) {
    this.tableName = tableName;
    this.db = db;
    this.docClient = docClient;
  }
  insertValidationData(type,sessionId,siteName,url,event, eventType,eventValue,status,failureReason) {
    // console.log("insertValidationData called");
    // console.log("insertValidationData type",type);
    // console.log("insertValidationData sessionId",sessionId);
    // console.log("insertValidationData siteName",siteName);
    // console.log("insertValidationData url",url);
    // console.log("insertValidationData event",event);
    // console.log("insertValidationData eventType",eventType);
    // console.log("insertValidationData eventValue",eventValue);
    // console.log("insertValidationData status",status);
    // console.log("insertValidationData failureReason",failureReason);
    const docClient = this.docClient;
    let uuid= uuidv4();
    console.log("insertValidationData uuid",uuid);
    const date = new Date().toISOString();
    const params = {
      TableName: this.tableName,
      Item: {
        Id:uuid,
        sessionId: sessionId,
        type:type,
        date: date,
        siteName:siteName,
        url: url,
        event: event,
        eventType:eventType,        
        eventValue: eventValue,
        status: status,
        reason: (failureReason!==null?failureReason:null)        
      },
    };
    return new Promise((resolve, reject) => {
      docClient.put(helper.removeEmptyStringElements(params), (err, data) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
  //Retrieve data for Events validation table - qa-analytics-validationevents-v2-beta 
  getValidationTestData() {
    const docClient = this.docClient;
    console.log()
    const projectionExpression = `Id,sessionId, #date, siteName, 
                       #status , #type,#url,event,eventType,eventValue,reason`;
  
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

module.exports = AdobeValidationTable;
