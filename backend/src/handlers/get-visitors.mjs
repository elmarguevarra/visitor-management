import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const DB_ENDPOINT_OVERRIDE = process.env.DB_ENDPOINT_OVERRIDE;
let ddbClient = undefined;

if (DB_ENDPOINT_OVERRIDE) {
  ddbClient = new DynamoDBClient({ endpoint: DB_ENDPOINT_OVERRIDE });
} else {
  ddbClient = new DynamoDBClient({});
  console.warn(
    "No value for DB_ENDPOINT_OVERRIDE provided for DynamoDB, using default"
  );
}

const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

const tableName = process.env.VISITORS_TABLE;
const frontEndBaseUrl = process.env.APP_FRONTEND_BASE_URL;

export const getVisitorsHandler = async (event) => {
  if (event.httpMethod !== "GET") {
    throw new Error(
      `getVisitors only accept GET method, you tried: ${event.httpMethod}`
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
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": frontEndBaseUrl,
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT",
    },
    body: JSON.stringify(items),
  };

  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  );
  return response;
};
