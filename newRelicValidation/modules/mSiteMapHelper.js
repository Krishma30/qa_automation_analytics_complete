'use strict';
// modules
const cheerio = require('cheerio');
const logger = require('../helpers/logger');
const requestPromise = require('request-promise');


async function fetchSiteMap(siteMapURL) {
  let options ='';

     options = {
      method: 'GET',
      uri: siteMapURL,
    };
  
  try {
    const body = await requestPromise(options);
    return body;
  } catch (err) {
    console.error(err);
    logger.error('Error getting sitemap');
    logger.error(err);
  }
};


function extractUrls(xml) {
  const urls = [];
  const $ = cheerio.load(xml, {xmlMode: true});

  $('loc').each(function() {
    const url = $(this).text();

    if (urls.indexOf(url) < 0) {
      urls.push(url);
    }
  });

  return urls;
}

async function getUrlsToTest(siteMapURL) {
  const xml = await fetchSiteMap(siteMapURL);
  const arrayOfUrls = extractUrls(xml);

  return arrayOfUrls;
}

module.exports = {
  getUrlsToTest,
};
