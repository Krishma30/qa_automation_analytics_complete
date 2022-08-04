const shortid = require('shortid');

// local modules
const siteMapHelper = require('./modules/mSiteMapHelper');
const analyticsValidator = require('./modules/parseUsingAPI.js');
const logger = require('./helpers/logger');
const sessions = require('./modules/sessions.js');
const timer = require('./modules/timer.js');
const helper = require('./modules/helpers.js');



//load config
const TEST_CONFIG = require('./testConfig/base.js');



// Command line parameter settings

const SITEMAP_URL = process.argv[2] || null;
const ENVIRONMENT = process.argv[3] || null;
//const SESSION_ID = process.argv[3];

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
        let urlsPerThread = Math.ceil(urlsToTest.length / TEST_CONFIG.threads);
        logger.log(`Items per Thread: ${urlsPerThread}`);

        let batches = [];
        let batch;
        let batchCount = 1;
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
async function processBatches(batches, sessionId, testCaseName) {

    await analyticsValidator
        .processBatches(batches, sessionId, testCaseName)
        .then(data => {
            const duration = timer.end();
            const results = data.results;
            //const diffCount = data.compareResults.filter(i => i.diffFound === true).length;
            //const passCount = data.compareResults.filter(i => i.diffFound === false).length;
            const pagePassCount = results.reduce((a, b) => a + b.passCount, 0);
            const pagefailCount = results.reduce((a, b) => a + b.clickValidationErrorsCount, 0);
            const clickValidationErrorsCount = results.reduce((a, b) => a + b.clickValidationErrorsCount, 0);
            logger.log('*************results back *********');
            logger.log("   clickValidationErrorsCount    " + clickValidationErrorsCount);
            sessions
                .endSession(sessionId, duration, {
                    passCount: pagePassCount,
                    failCount: pagefailCount,
                    clickValidationErrorsCount: clickValidationErrorsCount,
                })
                .catch(err => console.log(err));
          
            helper.writeResultsToCSV(results, sessionId);
            logger.header('COMPLETE - ' + sessionId);
        })
        .catch(err => {
            logger.error(err.message);
        });
}

async function runSession(siteMapURL, testCaseName) {
    timer.start();
    let urlsToTest = '', batches ='';
    const startTime = new Date().toISOString();
    const date = startTime
        .split('.')[0]
        .split(':')
        .join('-');

    const sessionId = date + '-' + shortid.generate();
    logger.header(`Running ${siteMapURL}, with ${sessionId} `);
    const checkURL = siteMapURL.split('.'); 
    urlsToTest = await getUrlsToTest(siteMapURL);
    logger.header(`START (${sessionId}): Processing ${urlsToTest.urlsToTest.length} pages`);
    batches = await getBatches(urlsToTest.urlsToTest);

    sessions.startSession(sessionId, testCaseName, urlsToTest).catch(err => console.log(err));
    logger.log(' session created');

    await processBatches(batches, sessionId, testCaseName);

}

(async() => {
    if(SITEMAP_URL === null){
        return;
    }
    let testCaseName = SITEMAP_URL.split('/');
    testCaseName = (testCaseName[2] + '_' + testCaseName[3]).split('.').join('_');
    await runSession(SITEMAP_URL, testCaseName);
})();