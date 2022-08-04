
// local modules
const siteMapHelper = require('./modules/mSiteMapHelper');
const cookieCaptureHelper = require('./modules/parser.js');
const logger = require('./helpers/logger');


const fs = require('fs-extra');
const csvtojson = require('csvtojson');

//load config
const TEST_CONFIG = require('./config/base.js');
const URL_LIST = ["https://www.dove.com/uk/sitemap.xml", "https://www.hellmanns.com/uk/sitemap.xml","https://www.tresemme.com/uk/sitemap.xml"];



// Command line parameter settings

const SITEMAP_URL = process.argv[2];
const SESSION_ID = process.argv[3];

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
});



async function getUrlsToTest(siteMapURL) {
    let urlsToTest = await siteMapHelper.getUrlsToTest(siteMapURL);
    return {
      urlsToTest
      };
}

async function getBatches(urlsToTest) {
  try {
    //logger.log(urlsToTest);
    let urlsPerThread = Math.ceil(urlsToTest.length / TEST_CONFIG.threads);
    logger.log(`Items per Thread: ${urlsPerThread}`);

    let batches = [];
    let batch;
    let batchCount = 1;//
    for (let i = 0; i < urlsToTest.length; i += urlsPerThread) { 
      batch = urlsToTest.slice(i, i + urlsPerThread);
      batches.push(batch);
      logger.log(`Batch ${batchCount} is ${batch.length} item(s)`);
      batchCount++;
    }
    return batches;
  } catch (err) {
    logger.error(err);
    return [];
  }
}

// await processBatches(batches, TEST_CONFIG, sessionId);
async function processBatches(batches, sessionId, batchId) {

  await cookieCaptureHelper
    .processBatches(batches,  sessionId, batchId);
    
}

async function runSession(siteMapURL, sessionId, batchId) {
    logger.header(`Running ${siteMapURL}, with ${sessionId} `);
    const urlsToTest = await getUrlsToTest(siteMapURL);
    logger.header(`START (${sessionId}): Processing ${urlsToTest.urlsToTest.length} pages`);
    const batches = await getBatches(urlsToTest.urlsToTest);
    await processBatches(batches, sessionId, batchId);
 
}

(async () => {
  // let urls = fs.readFileSync(URL_LIST);
  // console.log(urls);
  // let arrayOfUrls = parse(urls);
  // for(i in arrayOfUrls){
  //   console.log(i);
  // }
  // csvtojson.fromFile()
  for(i in URL_LIST){
    let csvFileName = URL_LIST[i].split('/');
    csvFileName = ( csvFileName[2] + '_' + csvFileName[3]).split('.').join('_');
    console.log(csvFileName);
    await runSession(URL_LIST[i], csvFileName, i);
  }
    
})();