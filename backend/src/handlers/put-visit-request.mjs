import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
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
const tableName = process.env.VISIT_REQUESTS_TABLE;

const frontEndBaseUrl = process.env.APP_FRONTEND_BASE_URL;

/**
 * A simple example includes a HTTP post method to add one item to a DynamoDB table.
 */
export const putVisitRequestHandler = async (event) => {
  if (event.httpMethod !== "POST") {
    throw new Error(
      `postMethod only accepts POST method, you tried: ${event.httpMethod} method.`
    );
  }
  // All log statements are written to CloudWatch
  console.info("received:", event);

  // Get id and name from the body of the request
  const body = JSON.parse(event.body);

  let residentId = body.residentId;
  let inviteToken = body.inviteToken;
  let registrationId = body.registrationId;
  let visitorName = body.visitorName;
  let visitDate = body.visitDate;
  let purpose = body.purpose;
  let requestStatus = body.requestStatus;

  // TODO: pass the "zone" from client to lambda via headers
  const localDateTime = DateTime.fromISO(visitDate, {
    zone: "Asia/Manila",
  }).startOf("day");

  console.log("localDateTime: ", localDateTime.toString());
  console.log("localDateTime.toISO(): ", localDateTime.toISO());
  console.log("localDateTime.toUTC().toISO(): ", localDateTime.toUTC().toISO());

  const inviteLinkExpirationTimeInHours = 24;
  const ttlInSeconds = calculateTTLInSeconds(
    localDateTime,
    inviteLinkExpirationTimeInHours
  );

  console.log("ttlInSeconds", ttlInSeconds);

  const params = {
    TableName: tableName,
    Item: {
      residentId: residentId,
      inviteToken: inviteToken,
      registrationId: registrationId,
      visitorName: visitorName,
      visitDate: localDateTime.toUTC().toISO(),
      purpose: purpose,
      requestStatus: requestStatus,
      requestExpiration: calculateDateFromTTLInSeconds(ttlInSeconds),
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
    residentId: params.Item.residentId,
    inviteToken: params.Item.inviteToken,
    registrationId: params.Item.registrationId,
    visitorName: params.Item.visitorName,
    visitDate: params.Item.visitDate,
    purpose: params.Item.purpose,
    requestStatus: params.Item.requestStatus,
    requestExpiration: params.Item.requestExpiration,
    ttl: params.Item.ttl,
  };

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": frontEndBaseUrl,
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
