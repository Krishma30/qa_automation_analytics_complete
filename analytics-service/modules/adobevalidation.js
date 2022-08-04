'use strict';

const genericJson = require('../json/adobe/generic.json');
const variableJson = require('../json/adobe/variables.json');
const regexJson = require('../json/common/regex.json');
const dbHelper = require('../modules/dbhelper');


module.exports.removeEmptyStringElements=(obj)=>{
    for (var prop in obj) {
      if (typeof obj[prop] === 'object') {
        this.removeEmptyStringElements(obj[prop]);
      } else if(obj[prop] === '') {
        delete obj[prop];
      }
    }
    return obj;
}

module.exports.getValuesForKey=(json,key)=>{
    console.log("getValuesForKey called");
    console.log("getValuesForKey json params",json);
    console.log("getValuesForKey key parama",key)
    let res = json.profiles.find(i => i.key === key);
    if (!res) {
        return null;
    }
    return {
        values: res.values
    };
}

module.exports.getValidationsForKey=(json, name)=>{
    console.log("getValidationsForKey called");
    console.log("getValidationsForKey variableJson params",json);
    console.log("getValidationsForKey name parama",name);
    let res = json.variables.find(i => i.name === name);
    if (!res) {
        return null;
    }
    return {
        type: res.validationtype,
        value: res.validationvalue
    };
}
module.exports.checkforAdobeEvents=(jsondata)=>{
    const url = jsondata.url;
    let uuid=jsondata.Id;
    return new Promise((resolve, reject) =>{
        let queryString = jsondata.queryString;
        let validatiortype= jsondata.type;
        let clickValidationResponse;
        let querystringevent = queryString.events.split(',');
        try{
            if(querystringevent.length){
                for (let i in querystringevent) {
                    let currentEvent = querystringevent[i];
                    let inputJson = this.getValuesForKey(genericJson, currentEvent);
                    console.log("Inside AdodeValdiation " + inputJson + ' for event ' + currentEvent);
                    if (inputJson != null) {
                        for (let j in inputJson.values) {    
                            let name = inputJson.values[j].name;    
                            let validationsJSON = this.getValidationsForKey(variableJson, name);
                            if (validationsJSON != null) {     
                                let type = validationsJSON.type;
                                let regexDef = validationsJSON.value;
                                let valToValidate = queryString[name];    
                                if (type == "Regex") {
                                    console.log("Inside AdodeValdiation 1111111" + inputJson + ' for event -->' + currentEvent);
                                    var regexPattern = this.getValuesForKey(regexJson, regexDef);            
                                    console.log(" got the value and the type --> " + type + "  with value -->  " + regexDef + "  with regex patten of --> " + regexPattern.values + "  validating value --> " + valToValidate)
                                    let vRegex = new RegExp(regexPattern.values);
                                    if (null == valToValidate) {
                                        clickValidationResponse = 'Couldnt find the value to validate in the request, missing value --> ' + name + ' for event --> ' + currentEvent;
                                        dbHelper.insertValidationData(validatiortype,jsondata.batchResultsSummary.sessionId,jsondata.batchResultsSummary.siteName, url,currentEvent, type,name,'failed',clickValidationResponse) ;   
                                        //this.writeAbodeValidationTestFailure(jsondata.batchResultsSummary.currentSessionId,jsondata.batchResultsSummary.siteName, url,currentEvent, type,name,'failed',clickValidationResponse);
                                    } else if (null == valToValidate.match(vRegex)) {
                                        clickValidationResponse = 'Regex match failed for regex patern -->' + regexDef + ' for event --> ' + currentEvent + ' with valueToValidte -->' + valToValidate;
                                        dbHelper.insertValidationData(validatiortype,jsondata.batchResultsSummary.sessionId,jsondata.batchResultsSummary.siteName, url,currentEvent, type,name,'failed',clickValidationResponse) ;   
                                        //this.writeAbodeValidationTestFailure(jsondata.batchResultsSummary.currentSessionId,jsondata.batchResultsSummary.siteName, url,currentEvent, type,name,'failed',clickValidationResponse);
                                        //this.writeAbodeValidationTestFailure(clickValidationResponse, url, currentEvent,name,type);
                                    }
                                }else if (type == "NA") {
                                    //check if this can be null
                                } else {
                                    dbHelper.insertValidationData(validatiortype,jsondata.batchResultsSummary.sessionId,jsondata.batchResultsSummary.siteName, url,currentEvent, type,name,'success') ;   
                                    //this.writeAbodeValidationTestFailure(jsondata.batchResultsSummary.currentSessionId,jsondata.batchResultsSummary.siteName, url,currentEvent, type,name,'success');
                                    //this.writeAbodeValidationTestFailure(clickValidationResponse, url, currentEvent,name,type);
                                    console.log("******** No validation error for value and the type --> " + type + "   validating value --> " + valToValidate);
                                }
                            }
                        }
                    }
                }
                resolve();
                //const inputJson = adobeValidation.getValuesForKey(genericJson, queryString.events);
            }
        } catch (err) {
            reject(err);
        }        
    });

};