'use strict';
const AWS = require('aws-sdk');

const SQS = new AWS.SQS();
class SendMessageSQS{
    constructor(queueName){
        this.queueName = queueName
    }
  async sendMessageToSQS(json) {
    console.log("Before submitting to queue");
    console.log(JSON.stringify(json) );
      const params = {
        MessageBody: JSON.stringify(json),
        QueueUrl: this.queueName,
      };
      return  SQS.sendMessage(params).promise();
  }
}
module.exports = SendMessageSQS

