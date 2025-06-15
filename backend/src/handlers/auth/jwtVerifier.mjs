import { CognitoJwtVerifier } from "aws-jwt-verify";

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID,
  tokenUse: "access",
  clientId: process.env.COGNITO_CLIENT_ID,
});

export const verifyToken = async (token) => {
  try {
    const rawToken = token.startsWith("Bearer ") ? token.split(" ")[1] : token;
    return await verifier.verify(rawToken);
  } catch (error) {
    console.error("Token verification failed:", error);
    throw new Error("Invalid token");
  }
};
