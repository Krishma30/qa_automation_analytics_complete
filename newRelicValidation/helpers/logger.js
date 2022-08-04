const FILE_LOGGER_ON = false;
const chalk = require('chalk');
const cLog = console.log;
const SimpleNodeLogger = require('simple-node-logger');
const opts = {
        logFilePath: `./logs/${new Date().toISOString()}-debug.csv`,
        timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS',
    };
let filelog = {info: () => console.log('File Logger is off (logger.js)')};
if (FILE_LOGGER_ON) {
  filelog = SimpleNodeLogger.createSimpleLogger( opts );
}


let dateStamp = new Date().toISOString();

function divide() {
  // cLog('------');
}

function header(message) {
   cLog('');
   cLog(chalk.inverse(' ' + message + ' '));
   cLog('');
}

function file(message) {
  filelog.info(message);
}

function log(message) {
   if (typeof message === 'object') {
     cLog(message);
   } else {
     cLog(`${dateStamp}: ${message}`);
   }
}

function goodNews(message) {
 cLog(chalk.green(`${dateStamp}: ${message}`));
}

function error(message) {
  // filelog.info(message);
  if (typeof message === 'object') {
    cLog(message);
  } else {
    cLog(chalk.red(`${dateStamp}: ${message}`));
  }
}

module.exports = {
  divide,
  header,
  log,
  goodNews,
  error,
  file,
};
