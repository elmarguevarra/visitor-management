import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

const ssm = new SSMClient({});

export const getParameterhandler = async (event) => {
  const param = event.queryStringParameters?.param;

  if (!param) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Missing required query parameter 'param'",
      }),
    };
  }

  const response = await ssm.send(
    new GetParameterCommand({
      Name: param,
      WithDecryption: false,
    })
  );

  // ✅ Return plain JSON
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sendEmailNotifications: response.Parameter.Value,
    }),
    isBase64Encoded: false,
  };
};
