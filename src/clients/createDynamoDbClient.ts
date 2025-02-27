import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export default function createDynamoDBClient() {
  const client = new DynamoDBClient();
  const dynamoDbDocumentClient = DynamoDBDocumentClient.from(client);

  return dynamoDbDocumentClient;
}
