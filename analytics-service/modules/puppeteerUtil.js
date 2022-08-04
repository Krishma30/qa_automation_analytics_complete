const chromium = require('chrome-aws-lambda');

/**
 * Puppeteer Utility for creating and closing headless chrome
 */
class PuppeteerUtil {
    // /**
    //  * Constructor for populating configuration
    //  * @param  {object} config - optional config params
    //  */
    // constructor(config) {
    //     this.config = config || {};
    // }

    /**
     * Create and returns chrome instance
     * @returns {object} PuppeteerUtil.browser - chrome instance
     */
    async getBrowser() {
        // All default (Refer to - https://github.com/alixaxel/chrome-aws-lambda)

        this.browser = await chromium.puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        });

        return this.browser;
    }

    /**
     * Close chrome instance
     */
    async closeBrowser() {
        if (this.browser !== null) {
            await this.browser.close();
        }
    }

}

module.exports = { PuppeteerUtil }
