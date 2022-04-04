import AWS from 'aws-sdk';

AWS.config.update({
  region: 'us-west-1',
  endpoint: process.env.Endpoint,
  accessKeyId: process.env.DynamoDBAccessKeyId,
  secretAccessKey: process.env.DynamoDBSecretAccessKey,
});

export const docClient = new AWS.DynamoDB.DocumentClient();
