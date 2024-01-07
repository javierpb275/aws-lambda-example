import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as dynamoose from "dynamoose";
import config from "./config/config";

// Create new DynamoDB instance
const ddb = new dynamoose.aws.ddb.DynamoDB({
  credentials: {
    accessKeyId: config.DB.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.DB.AWS_SECRET_ACCESS_KEY,
  },
  region: config.DB.AWS_REGION,
});

// Set DynamoDB instance to the Dynamoose DDB instance
dynamoose.aws.ddb.set(ddb);

// Define a model using Dynamoose
const YourSchema = new dynamoose.Schema({
  someid: String,
  name: String,
  // Add other attributes as needed
});

const YourModel = dynamoose.model("YourTableName", YourSchema);

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
        // Create item in DynamoDB using Dynamoose
        await YourModel.create({ someid: someIdParam, name });
        return {
          statusCode: 200,
          body: JSON.stringify({
            message: `Created item with someid: ${someIdParam}`,
          }),
        };
      case "GET":
        // Retrieve item from DynamoDB using Dynamoose
        const getItemResult = await YourModel.get({ someid: someIdParam });
        return {
          statusCode: 200,
          body: JSON.stringify(getItemResult),
        };
      case "PUT":
        // Update item in DynamoDB using Dynamoose
        await YourModel.update({ someid: someIdParam }, { name });
        return {
          statusCode: 200,
          body: JSON.stringify({
            message: `Updated item with someid: ${someIdParam}`,
          }),
        };
      case "DELETE":
        // Delete item from DynamoDB using Dynamoose
        await YourModel.delete({ someid: someIdParam });
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
