import AWS from 'aws-sdk';

AWS.config.update({
  region: 'us-west-1',
  endpoint: 'https://dynamodb.us-west-1.amazonaws.com',
  accessKeyId: process.env.DynamoDBAccessKeyId,
  secretAccessKey: process.env.DynamoDBSecretAccessKey,
});

export const docClient = new AWS.DynamoDB.DocumentClient();
