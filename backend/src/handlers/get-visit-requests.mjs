// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

//DynamoDB Endpoint
const DB_ENDPOINT_OVERRIDE = process.env.DB_ENDPOINT_OVERRIDE;
let ddbClient = undefined;

if (DB_ENDPOINT_OVERRIDE) {
  ddbClient = new DynamoDBClient({ endpoint: DB_ENDPOINT_OVERRIDE });
} else {
  ddbClient = new DynamoDBClient({}); // Use default values for DynamoDB endpoint
  console.warn(
    "No value for DB_ENDPOINT_OVERRIDE provided for DynamoDB, using default"
  );
}

const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

// Get the DynamoDB table name from environment variables
const tableName = process.env.VISIT_REQUESTS_TABLE;

const frontEndBaseUrl = process.env.APP_FRONTEND_BASE_URL;
/**
 * A simple example includes a HTTP get method to get all items from a DynamoDB table.
 */
export const getVisitRequestsHandler = async (event) => {
  if (event.httpMethod !== "GET") {
    throw new Error(
      `getUserItems only accept GET method, you tried: ${event.httpMethod}`
    );
  }
  // All log statements are written to CloudWatch
  console.info("received:", event);

  const residentId = event.queryStringParameters
    ? event.queryStringParameters.residentId
    : undefined;
  console.debug("residentId from query:", residentId);

  // get all items from the table (only first 1MB data, you can use `LastEvaluatedKey` to get the rest of data)
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#scan-property
  // https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html
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
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": frontEndBaseUrl,
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT",
    },
    body: JSON.stringify(items),
  };

  // All log statements are written to CloudWatch
  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  );
  return response;
};
