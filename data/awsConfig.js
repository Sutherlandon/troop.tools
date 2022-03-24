import AWS from 'aws-sdk';
  console.log('aws-config');
  console.log(process.env.DynamoDBAccessKeyId);
  console.log(process.env.DynamoDBSecretAccessKey);

AWS.config.update({
  region: 'us-west-1',
  endpoint: 'https://dynamodb.us-west-1.amazonaws.com',
  accessKeyId: process.env.DynamoDBAccessKeyId,
  secretAccessKey: process.env.DynamoDBSecretAccessKey,
});

export const docClient = new AWS.DynamoDB.DocumentClient();
