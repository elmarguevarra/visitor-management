// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

//DynamoDB Endpoint
const ENDPOINT_OVERRIDE = process.env.ENDPOINT_OVERRIDE;
let ddbClient = undefined;

if (ENDPOINT_OVERRIDE) {
  ddbClient = new DynamoDBClient({ endpoint: ENDPOINT_OVERRIDE });
} else {
  ddbClient = new DynamoDBClient({}); // Use default values for DynamoDB endpoint
  console.warn(
    "No value for ENDPOINT_OVERRIDE provided for DynamoDB, using default"
  );
}

const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

const tableName = process.env.VISITORS_TABLE;

export const getVisitorsHandler = async (event) => {
  if (event.httpMethod !== "GET") {
    throw new Error(
      `getUserItems only accept GET method, you tried: ${event.httpMethod}`
    );
  }
  console.info("received:", event);

  const residentId = event.queryStringParameters
    ? event.queryStringParameters.residentId
    : undefined;
  console.log("residentId from query:", residentId);

  var params = {
    TableName: tableName,
  };

  if (residentId) {
    console.info(`Filtering by residentId: ${residentId}`);
    params.FilterExpression = "residentId = :residentIdValue";
    params.ExpressionAttributeValues = {
      ":residentIdValue": residentId,
    };
  }

  try {
    const data = await ddbDocClient.send(new ScanCommand(params));
    var items = data.Items;
  } catch (err) {
    console.error("Error retrieving all items:", err.message);
    console.error("Error code:", err.code);
    console.error("Error name:", err.name);
    console.error("Error stack:", err.stack);

    throw err;
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify(items),
  };

  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  );
  return response;
};
