import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

// DynamoDB Endpoint
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

// Get the DynamoDB table name from environment variables
const tableName = process.env.VISIT_REQUESTS_TABLE;

/**
 * A simple example includes an HTTP GET method to get one item by id from a DynamoDB table.
 */
export const getVisitRequestByTokenHandler = async (event) => {
  if (event.httpMethod !== "GET") {
    throw new Error(
      `getMethod only accepts GET method, you tried: ${event.httpMethod}`
    );
  }
  // All log statements are written to CloudWatch
  console.info("received:", event);

  // Get inviteToken from pathParameters from API Gateway because of `/{inviteToken}` at template.yaml
  const inviteToken = event.pathParameters.inviteToken;

  // Get the item from the table
  var params = {
    TableName: tableName,
    Key: { inviteToken: inviteToken },
  };

  let item = null;
  try {
    const data = await ddbDocClient.send(new GetCommand(params));
    item = data.Item;
  } catch (err) {
    console.error("Error retrieving item:", err.message);
    console.error("Error code:", err.code);
    console.error("Error name:", err.name);
    console.error("Error stack:", err.stack);

    // Return 500 error if there's an issue with DynamoDB
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "https://vms.alphinecodetech.click",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT",
      },
      body: JSON.stringify({
        error: "An error occurred while retrieving the invite.",
      }),
    };
  }

  // Return the found item
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "https://vms.alphinecodetech.click",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT",
    },
    body: JSON.stringify(item),
  };

  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  );
  return response;
};
