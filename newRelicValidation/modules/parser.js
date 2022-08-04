const puppeteer = require('puppeteer');



const analyticsTests = require('./analyticsTests');

//load config
const TEST_CONFIG = require('../testConfig/base.js');
const logger = require('../helpers/logger');
const helpers = require('./helpers');
const fs = require('fs-extra');



let results = [];
let finalResults  = new Map();


function getBatchStatus(index, batchNo, urls) {
  return {
    batchNo: batchNo,
    index: index + 1,
    batchSize: urls.length,
    asString: `#${batchNo}:${index + 1}/${urls.length}`,
  };
}



async function processBatches( batches, sessionId, batchId) {
  try {
    //download config json for this session id - getConfigJsonforSessionId
    let resultsPromises = [];

    for (let i = 0; i < batches.length; i++) {
      const batchPromise = captureAnalyticsTagsBatch(batches[i], sessionId, i+1);
      resultsPromises.push(batchPromise);
    }
    const results = await handleResultsPromises(resultsPromises);
    logger.goodNews("Got the results back... " +  results);

    console.log('********************' + sessionId);

    await helpers.writeResultsToCSV(results, sessionId, batchId);

   
    return {
      results,
    };
  } catch (err) {
    logger.error('Error in processBatches: ' + err.message);
    
  }
  
}

async function handleResultsPromises(resultsPromises) {
  try {
    const res = await Promise.all(resultsPromises);
    
    res.forEach(data => {
      console.log("************** adding it ");
      results.push({
        brand: data.brand,
        markersList: data.markersList,    
        markersCount : data.markersCount,
        details :  data.details,
        counter : data.counter,
      });
    });
   // console.log(results);
    return results;
  } catch (err) {
    logger.error('Error in handleResultsPromises: ' + err.message);
    return [];
  }
}

async function captureAnalyticsTagsBatch(urls, sessionId, batchNo) {
  logger.log('Starting batch ' + batchNo);
  let batchResultsSummary = {
    brand: 0,
    markersList: [],
    markersCount : 0,
    details: [],
    counter : 0,
  };

  let browser;
  let pageInfo;


  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      ignoreHTTPSErrors: false,
    });
    for (let i = 0; i < 5; i++) {
      pageInfo = urls[i];
      batchResultsSummary.batchStatus = getBatchStatus(i, batchNo, urls);
      const page = await browser.newPage();
       logger.log("Starting with.... " +pageInfo);
    

      const response = await page.goto(pageInfo, {
        timeout: TEST_CONFIG.pageTimeout,
        waitUntil: 'networkidle0',
      });



         if(await page.$('#_evidon-banner-acceptbutton') != null){
          await page.click('#_evidon-banner-acceptbutton');
          await page.waitForNavigation(); 
        }

        

        if(TEST_CONFIG.staging){
          console.log("****************its enabled ");
          const json = await page.evaluate(() => {
            let json = {};
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              json[key] = localStorage.getItem(key);
            }
            return json;
          });
          json.sdsat_stagingLibrary = true;
        //  console.log(json);
  
     
          fs.writeFileSync('./local/'+sessionId+'_local.json', JSON.stringify(json));
  
          
            let json1 = JSON.parse(fs.readFileSync('./local/'+sessionId+'_local.json'));
            await page.evaluate(json => {
              localStorage.clear();
              for (let key in json){
                localStorage.setItem(key, json[key]);
  
              }
                
                localStorage.setItem('sdsat_stagingLibrary',true);
            }, json);
         
       
          console.log("after");
          console.log(json1);


      const reload = await page.reload(pageInfo, {
        timeout: TEST_CONFIG.pageTimeout,
        waitUntil: 'networkidle0',
      });

        }

       
 

        await analyticsTests.runTests(page, pageInfo, batchResultsSummary);

        logger.log("done with.... " +pageInfo);

      
       }
       browser.close();
      } catch (err) {
        logger.error('Error in captureAnalyticsTagsBatch: ' + err.message);
        browser.close();
      }
      return batchResultsSummary;
    }

module.exports = {
  processBatches,
};