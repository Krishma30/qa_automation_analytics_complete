'use strict';

class SessionsTable {
  constructor(tableName, db, docClient) {
    this.tableName = tableName;
    this.db = db;
    this.docClient = docClient;
  }
  startSession(sessionId, siteName, numberOfPages) {
    const docClient = this.docClient;
    const date = new Date().toISOString();
    const params = {
      TableName: this.tableName,
      Item: {
        sessionId: sessionId,
        date: date,
        siteName: siteName,
        numberOfPages: numberOfPages,
        failCount: 0,
        passCount: 0,    
        errors : 0,
        duration: 0,
        completed: 0,
        clickValidationErrorsCount :  0,
      },
    };
    return new Promise((resolve, reject) => {
      docClient.put(params, (err, data) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  endSession(sessionId, duration, results) {
    console.log('end session ', results);
    const docClient = this.docClient;
    const updateExpression = `SET #duration = :duration,
      completed = :completed,
      passCount = :passCount,
      failCount = :failCount,
      clickValidationErrorsCount = :clickValidationErrorsCount`;
    const params = {
      TableName: this.tableName,
      Key: {
        sessionId: sessionId,
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: {
        '#duration': 'duration',
      },
      ExpressionAttributeValues: {
        ':duration': duration,
        ':completed': 99,
        ':passCount': results.passCount,
        ':failCount': results.clickValidationErrorsCount,
        ':clickValidationErrorsCount': results.clickValidationErrorsCount ? results.clickValidationErrorsCount : 0,
      },
      ReturnValues: 'UPDATED_NEW',
    };
    return new Promise((resolve, reject) => {
      docClient.update(params, (err, data) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
}

getTestSessions() {
  const docClient = this.docClient;
  console.log()
  const projectionExpression = `sessionId, #date, siteName, 
                     failCount, passCount,errors, #duration, completed, clickValidationErrorsCount`;

  const params = {
    TableName: this.tableName,
    ProjectionExpression: projectionExpression,
    ExpressionAttributeNames: {
      '#date': 'date',
      '#duration': 'duration',
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

updateCounter(sessionId, passed) {
  const docClient = this.docClient;
  const params = {
    TableName: this.tableName,
    Key: {
      sessionId: sessionId,
    },
    UpdateExpression: 'SET #counter = #counter + :incr',
    ExpressionAttributeNames: {
      '#counter': 'counter',
    },
    ExpressionAttributeValues: {
      ':incr': 1,
    },
    ReturnValues: 'UPDATED_NEW',

  };
  return this.updatePassFailCount(sessionId, passed)
    .then(() => {
      return new Promise((resolve, reject) => {
        docClient.update(params, (err, data) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    })
    .catch(err => {
      console.log('----');
      console.log(err);
      return Promise.reject(err);
    });
}
updatePassFailCount(sessionId, passed) {
  const docClient = this.docClient;
  let UpdateExpression = 'SET failCount = failCount + :incr';
  if (passed) {
    UpdateExpression = 'SET passCount = passCount + :incr';
  }
  const params = {
    TableName: this.tableName,
    Key: {
      sessionId: sessionId,
    },
    UpdateExpression: UpdateExpression,
    ExpressionAttributeValues: {
      ':incr': 1,
    },
    ReturnValues: 'UPDATED_NEW',
  };
  return new Promise((resolve, reject) => {
    docClient.update(params, (err, data) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}
}

module.exports = SessionsTable;
