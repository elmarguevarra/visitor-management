import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import {
  calculateDateFromTTLInSeconds,
  calculateTTLInSeconds,
} from "./utils.mjs";
import { DateTime } from "luxon";

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

// Get the DynamoDB table name from environment variables
const tableName = process.env.INVITE_LINKS_TABLE;
const frontEndBaseUrl = process.env.APP_FRONTEND_BASE_URL;

/**
 * A simple example includes a HTTP post method to add one item to a DynamoDB table.
 */
export const putInviteLinkItemHandler = async (event) => {
  if (event.httpMethod !== "POST") {
    throw new Error(
      `postMethod only accepts POST method, you tried: ${event.httpMethod} method.`
    );
  }
  console.info("received:", event);

  const body = JSON.parse(event.body);

  let inviteToken = body.inviteToken;
  let residentId = body.residentId;
  let inviteLinkExpiration = body.inviteLinkExpiration;
  let ttlInSeconds;

  if (!inviteToken) {
    inviteToken = uuidv4();
  }
  const inviteLink = `${frontEndBaseUrl}/self-register-visitor/${inviteToken}`;

  if (inviteLinkExpiration) {
    ttlInSeconds = calculateTTLInSeconds(inviteLinkExpiration);
  } else {
    const inviteLinkExpirationTimeInHours = 24;
    const localDateTime = DateTime.now().setZone("Asia/Manila");
    ttlInSeconds = calculateTTLInSeconds(
      localDateTime,
      inviteLinkExpirationTimeInHours
    );
  }

  const params = {
    TableName: tableName,
    Item: {
      inviteToken: inviteToken,
      residentId: residentId,
      inviteLink: inviteLink,
      inviteLinkExpiration: calculateDateFromTTLInSeconds(ttlInSeconds),
      ttl: ttlInSeconds,
    },
  };

  try {
    const data = await ddbDocClient.send(new PutCommand(params));
    console.log("Success - item added or updated", data);
  } catch (err) {
    console.error("Error adding or updating item:", err.message);
    console.error("Error code:", err.code);
    console.error("Error name:", err.name);
    console.error("Error stack:", err.stack);

    throw err;
  }

  const responseBody = {
    inviteToken: params.Item.inviteToken,
    residentId: params.Item.residentId,
    inviteLink: params.Item.inviteLink,
    inviteLinkExpiration: params.Item.inviteLinkExpiration,
    ttl: params.Item.ttl,
  };

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "https://vms.alphinecodetech.click",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT",
    },
    body: JSON.stringify(responseBody),
  };

  // All log statements are written to CloudWatch
  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  );
  return response;
};
