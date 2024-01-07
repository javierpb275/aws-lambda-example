import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import AWS from "aws-sdk";

// Initialize DynamoDB Document Client
const dynamoDB = new AWS.DynamoDB.DocumentClient();

export const hello: (
  event: APIGatewayProxyEvent
) => Promise<APIGatewayProxyResult> = async (event) => {
  try {
    const { httpMethod, body } = event;
    const { name } = JSON.parse(body || "{}");
    const authorizationHeader = event.headers?.Authorization || "";
    const someIdParam = event.pathParameters?.someid || "";
    const queryParams = event.queryStringParameters || {};

    if (!name || !someIdParam) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Name and someid are required" }),
      };
    }

    // Extracting the token from the Authorization header
    const token = authorizationHeader.split(" ")[1]; // Assuming "Bearer <token>"

    // Perform CRUD operations based on HTTP method
    switch (httpMethod) {
      case "POST":
        // Create item in DynamoDB
        await dynamoDB
          .put({
            TableName: "YourTableName",
            Item: {
              someid: someIdParam,
              name: name,
              // Add other attributes as needed
            },
          })
          .promise();
        return {
          statusCode: 200,
          body: JSON.stringify({
            message: `Created item with someid: ${someIdParam}`,
          }),
        };
      case "GET":
        // Retrieve item from DynamoDB
        const getItemResult = await dynamoDB
          .get({
            TableName: "YourTableName",
            Key: {
              someid: someIdParam,
            },
          })
          .promise();
        return {
          statusCode: 200,
          body: JSON.stringify(getItemResult.Item),
        };
      case "PUT":
        // Update item in DynamoDB
        await dynamoDB
          .update({
            TableName: "YourTableName",
            Key: {
              someid: someIdParam,
            },
            UpdateExpression: "SET #name = :newName",
            ExpressionAttributeNames: {
              "#name": "name",
            },
            ExpressionAttributeValues: {
              ":newName": name,
            },
          })
          .promise();
        return {
          statusCode: 200,
          body: JSON.stringify({
            message: `Updated item with someid: ${someIdParam}`,
          }),
        };
      case "DELETE":
        // Delete item from DynamoDB
        await dynamoDB
          .delete({
            TableName: "YourTableName",
            Key: {
              someid: someIdParam,
            },
          })
          .promise();
        return {
          statusCode: 200,
          body: JSON.stringify({
            message: `Deleted item with someid: ${someIdParam}`,
          }),
        };
      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ message: "Invalid HTTP Method" }),
        };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
