import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

const ssm = new SSMClient({});

export const getParameterhandler = async (param) => {
  const response = await ssm.send(
    new GetParameterCommand({
      Name: param,
      WithDecryption: false,
    })
  );

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sendEmailNotifications: response.Parameter.Value,
    }),
  };
};
