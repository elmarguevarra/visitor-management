import {
  VerifiedPermissionsClient,
  BatchIsAuthorizedCommand,
} from "@aws-sdk/client-verifiedpermissions";

const verifiedPermissionsClient = new VerifiedPermissionsClient();
const policyStoreId = process.env.POLICY_STORE_ID;

export const getPermissionsHandler = async (event) => {
  if (event.httpMethod !== "GET") {
    throw new Error(
      `getPermissions only accept GET method, you tried: ${event.httpMethod}`
    );
  }
  console.info("received:", event);

  const principalId = event.queryStringParameters.principalId;

  const actions = event.queryStringParameters.actions
    ? event.queryStringParameters.actions.split(",").map((a) => a.trim())
    : [];

  const batchIsAuthorizedInput = {
    policyStoreId,
    requests: actions.map((action) => ({
      principal: {
        entityId: principalId,
        entityType: "VisitorManagement::UserGroup",
      },
      resource: {
        entityId: "visitorResource",
        entityType: "VisitorManagement::Visitor",
      },
      action: {
        actionId: action,
        actionType: "VisitorManagement::Action",
      },
    })),
  };

  console.log("batchIsAuthorizedInput: ", batchIsAuthorizedInput);
  const command = new BatchIsAuthorizedCommand(batchIsAuthorizedInput);

  try {
    const batchIsAuthorizedOutput = await verifiedPermissionsClient.send(
      command
    );
    console.log("batchIsAuthorizedOutput: ", batchIsAuthorizedOutput);
  } catch (err) {
    console.error("Error checking batch authorization:", err);
    throw new Error("Failed to evaluate access");
  }

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*", //DO NOT USE THIS VALUE IN PRODUCTION - https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-cors.html
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT",
    },
    body: JSON.stringify(batchIsAuthorizedOutput),
  };

  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  );
  return response;
};
