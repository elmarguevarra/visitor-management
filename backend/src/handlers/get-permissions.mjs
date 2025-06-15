import {
  VerifiedPermissionsClient,
  BatchIsAuthorizedCommand,
} from "@aws-sdk/client-verifiedpermissions";
import { ENTITY_TYPES, RESOURCES } from "../constants/authorizer.mjs";

const verifiedPermissionsClient = new VerifiedPermissionsClient();
const policyStoreId = process.env.POLICY_STORE_ID;
const frontEndBaseUrl = process.env.APP_FRONTEND_BASE_URL;

const cache = new Map();

export const getPermissionsHandler = async (event) => {
  if (event.httpMethod !== "GET") {
    throw new Error(
      `getPermissions only accept GET method, you tried: ${event.httpMethod}`
    );
  }
  console.info("received:", event);

  const cacheKey = JSON.stringify(event);
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  const principalId = event.queryStringParameters.principalId;
  const actions = event.queryStringParameters.actions
    ? event.queryStringParameters.actions.split(",").map((a) => a.trim())
    : [];

  const batchIsAuthorizedInput = {
    policyStoreId,
    requests: actions.map((action) => ({
      principal: {
        entityId: principalId,
        entityType: ENTITY_TYPES.USER_GROUP,
      },
      resource: {
        entityId: RESOURCES.VISITOR,
        entityType: ENTITY_TYPES.RESOURCE,
      },
      action: {
        actionId: action,
        actionType: ENTITY_TYPES.ACTION,
      },
    })),
  };

  console.log("batchIsAuthorizedInput: ", batchIsAuthorizedInput);
  const command = new BatchIsAuthorizedCommand(batchIsAuthorizedInput);

  var batchIsAuthorizedOutput;
  try {
    batchIsAuthorizedOutput = await verifiedPermissionsClient.send(command);
    console.log("batchIsAuthorizedOutput: ", batchIsAuthorizedOutput);
  } catch (err) {
    console.error("Error checking batch authorization:", err);
    throw new Error("Failed to evaluate access");
  }

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": frontEndBaseUrl,
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT",
    },
    body: JSON.stringify(batchIsAuthorizedOutput),
  };

  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  );

  cache.set(cacheKey, response);
  return response;
};
