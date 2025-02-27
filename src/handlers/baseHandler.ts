import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export abstract class BaseHandler {
  protected createResponse(
    statusCode: number,
    body: object
  ): APIGatewayProxyResult {
    return {
      statusCode,
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    };
  }

  abstract processEvent(
    event: APIGatewayProxyEvent
  ): Promise<APIGatewayProxyResult>;
}
