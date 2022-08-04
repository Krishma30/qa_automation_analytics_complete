// includes
const logger = require('../helpers/logger');




// test Digital Data Object
async function testDigitalDataObject(page, url, batchResultsSummary) {

    var attributesKeys;
    var details = new Map();
    try {
        const newRelicData = await page.evaluate(() => {
            
           
            let returnData;
            if (typeof newrelic != 'undefined') {
                newrelicJSAtrributes = newrelic.info.jsAttributes;
                pageType = digitalData.page.category.pageType;
                returnData = {
                    newrelicJSAtrributes,
                };
            }
            return returnData;
        });

        if(newRelicData == 'undefined'){
            console.log("New Relic undefined");


        } else{
            for (i in newRelicData){
                console.log(newRelicData[i]);
          

                for (const [key, value] of Object.entries(newRelicData[i])) {
                   // console.log(`${key} ${value}`);
                  // console.log(key +  value); 
                    //attributesData.set(key, value);
                    if(key == 'BrandName'){
                        batchResultsSummary.brand= value;

                    }
                    attributesKeys = attributesKeys + ' : '+key;
                    batchResultsSummary.markersList.push(key);
                    batchResultsSummary.details.push(url + ' : '+ key);
                   
                    batchResultsSummary.counter ++;
                  }
                //   console.log('detaisl');

                //   console.log(details);

         
                //console.log('For URL ' + url + ' getting all values ' + newRelicData[i]);
              //  console.log(Object.keys(newRelicData[i]));
                
                /// 2 variables here, one with complete summary and second short summary
               
            }
        }
    } catch (err) {
        logger.error('Error in testDigitalDataObject: ' + err.message);
        throw err;
    }
}




async function runTests(page, url, batchResultsSummary) {
    try {
        await testDigitalDataObject(page, url, batchResultsSummary);
     //   await testAdobeHeaderScript(page, url, batchResultsSummary);
     //   await testFooterSatelliteScript(page, url, batchResultsSummary);
    } catch (err) {
        logger.error('Error in testAnalytics: ' + err.message);
        throw err;
    }
}

module.exports = {
    runTests,
};
