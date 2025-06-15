import {
  VerifiedPermissionsClient,
  IsAuthorizedCommand,
} from "@aws-sdk/client-verifiedpermissions";
import { ENTITY_TYPES, RESOURCES } from "../../constants/authorizer.mjs";
import { verifyToken } from "./jwtVerifier.mjs";

const client = new VerifiedPermissionsClient();
const policyStoreId = process.env.POLICY_STORE_ID;
const frontEndBaseUrl = process.env.APP_FRONTEND_BASE_URL;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": frontEndBaseUrl,
  "Access-Control-Allow-Headers":
    "Content-Type,Authorization,X-Required-Permission",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT",
  "Access-Control-Expose-Headers": "X-Required-Permission",
  "Access-Control-Allow-Credentials": "true",
};

export const verifiedPermissionsAuthorizerHandler = async (event) => {
  try {
    // const token = event.headers.authorization || event.headers.Authorization;
    // if (!token) {
    //   return {
    //     isAuthorized: false,
    //     context: CORS_HEADERS,
    //   };
    // }

    // const decoded = await verifyToken(token);
    // const principalId = decoded["cognito:groups"].find(
    //   (g) => !g.endsWith("_Google")
    // );

    // const actionId = event.headers["X-Required-Permission"];

    // const command = new IsAuthorizedCommand({
    //   policyStoreId: policyStoreId,
    //   principal: {
    //     entityId: principalId,
    //     entityType: ENTITY_TYPES.USER_GROUP,
    //   },
    //   resource: {
    //     entityId: RESOURCES.VISITOR,
    //     entityType: ENTITY_TYPES.RESOURCE,
    //   },
    //   action: {
    //     actionId: actionId,
    //     actionType: ENTITY_TYPES.ACTION,
    //   },
    // });

    // const authResult = await client.send(command);
    // if (authResult.decision !== "ALLOW") {
    //   return {
    //     isAuthorized: false,
    //     context: CORS_HEADERS,
    //   };
    // }

    return {
      isAuthorized: true,
      context: CORS_HEADERS,
    };
  } catch (error) {
    console.error("Authorization error:", error);
    return {
      isAuthorized: false,
      context: CORS_HEADERS,
    };
  }
};
