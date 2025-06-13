import { VerifiedPermissionsClient } from "@aws-sdk/client-verifiedpermissions";

const verifiedPermissionsClient = new VerifiedPermissionsClient();
const policyStoreId = process.env.POLICY_STORE_ID;

export const verifiedpermissionsMiddleware = () => {
  return {
    before: async (request) => {
      const event = request.event;
      const claims = event?.requestContext?.authorizer?.claims;

      console.log(event);
      console.log(claims);
    },
  };
};
