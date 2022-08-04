
const chromium = require('chrome-aws-lambda');

let array_abodeQueryString = []
/**
 * Logic for fetching pge level analyticcs
 * @param {string} url - URL of the page to be checked for
 */
let getPageInfo =  async(url) => {
    let  browser, page;
    try {
        console.log("Inside pageInfo with url to execute as " + url);
       // puppeteerUtil = new PuppeteerUtil();
       // browser = await puppeteerUtil.getBrowser();


        browser = await chromium.puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        });
        // Create new page
        page = await browser.newPage();
        // // Authentication for lower environment
        // envCredential = await getCredential(platform); 
        // //console.log(`cred: ${JSON.stringify(envCredential)}`);

        //block.push('https://js-agent.newrelic.com/');
        

        // Goto the page
        await page.goto(url, {
            waitUntil: 'load'
        });
        

        let scriptTagUrls = await page.$$eval('script', script => {
            let results = [];
            for (let i = 0; i < script.length; i++) {
                results.push(script[i].src);
            }
            return results;
        });
        let analyticsData = await page.evaluate(getAnalyticsData);
        
        return await {
            scriptTagUrls,
            analyticsData
        };
    } catch (error) {
        console.log(`
            PuppeteerUtil Error
            -------------------
            ${error.stack}
        `);
        throw error;

    } finally {
        console.log(`
        PuppeteerUtil Finally
        -------------------
        `);
        if (browser !== null) {
            await browser.close();
        }
    }
};


async function getAnalyticsData() {
    // Validating Google data
        const pageURL = document.location.href; 
        let digitalDataObjectPageURL = '',
            digitalDataObjectCountry = '',
            returnData,
            site_tid, baseUrl,
            channel, localBrand, globalBrand, brandCategory, country, sitetype, site_report_suite;
        // Picking data from page viewsource
        if (typeof digitalData != 'undefined') {
            digitalDataObjectPageURL = digitalData.page.pageInfo.destinationURL;
            digitalDataObjectCountry = digitalData.page.attributes.country;
            if(digitalData.trackingInfo.tool[0] != null)
            site_tid = digitalData.trackingInfo.tool[0].id;
            baseUrl =  digitalData.siteInfo.internalDomain;
            channel = digitalData.siteInfo.channel;
            localBrand = digitalData.page.attributes.localBrand;
            globalBrand = digitalData.page.attributes.globalBrand;
            brandCategory = digitalData.page.attributes.brandCategory;
            country = digitalData.page.attributes.country;
            sitetype = digitalData.siteInfo.sitetype;
            if(digitalData.trackingInfo.tool[1] != null)
            site_report_suite =  digitalData.trackingInfo.tool[1].id;
            returnData = {
                pageURL, baseUrl,
                digitalDataObjectPageURL,
                digitalDataObjectCountry,
                site_tid,
                channel, localBrand, globalBrand, brandCategory, country, sitetype, site_report_suite
            };
        }
        console.log('****** RETURN ANALYTICS DATA from Page ****** '+returnData);
        return returnData;

}
module.exports = {
    getPageInfo
};
