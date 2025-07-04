import {
  VerifiedPermissionsClient,
  IsAuthorizedCommand,
} from "@aws-sdk/client-verifiedpermissions";
import { ENTITY_TYPES, RESOURCES } from "../../constants/authorizer.mjs";
import { verifyToken } from "./jwtVerifier.mjs";

const client = new VerifiedPermissionsClient();
const policyStoreId = process.env.POLICY_STORE_ID;

const cache = new Map();

export const verifiedPermissionsAuthorizerHandler = async (event) => {
  try {
    const cacheKey = JSON.stringify(event);
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    const token = event.headers.authorization || event.headers.Authorization;
    if (!token) throw new Error("Missing token");

    const decoded = await verifyToken(token);
    const principalId = decoded["cognito:groups"].find(
      (g) => !g.endsWith("_Google")
    );

    const actionId =
      event.headers["x-required-permission"] ||
      event.headers["X-Required-Permission"];

    const methodArn = event.methodArn;

    const command = new IsAuthorizedCommand({
      policyStoreId,
      principal: {
        entityId: principalId,
        entityType: ENTITY_TYPES.USER_GROUP,
      },
      resource: {
        entityId: RESOURCES.VISITOR,
        entityType: ENTITY_TYPES.RESOURCE,
      },
      action: {
        actionId: actionId,
        actionType: ENTITY_TYPES.ACTION,
      },
    });

    const authResult = await client.send(command);
    const isAllowed = authResult.decision === "ALLOW";

    console.log("authResult: ", JSON.stringify(authResult));

    const response = {
      principalId,
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: isAllowed ? "Allow" : "Deny",
            Resource: methodArn,
          },
        ],
      },
      context: {
        email: decoded.email,
        group: principalId,
      },
    };
    cache.set(cacheKey, response);
    return response;
  } catch (error) {
    console.error("Authorization error:", error);

    return {
      principalId: "unauthorized",
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Deny",
            Resource: event.methodArn,
          },
        ],
      },
      context: {},
    };
  }
};
