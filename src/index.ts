import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const hello: (
  event: APIGatewayProxyEvent
) => Promise<APIGatewayProxyResult> = async (event) => {
  try {
    const { name } = JSON.parse(event.body || "{}");
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

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Hello, ${name}! Received token: ${token}. Received someid: ${someIdParam}. Query parameters: ${JSON.stringify(
          queryParams
        )}`,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
