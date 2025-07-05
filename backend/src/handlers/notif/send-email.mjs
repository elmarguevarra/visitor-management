import { SESClient, SendTemplatedEmailCommand } from "@aws-sdk/client-ses";
const ses = new SESClient();

export const sendEmailHandler = async (event) => {
  const params = {
    Source: "elmar.guevarra@icloud.com",
    Destination: {
      ToAddresses: ["elmarguevarra31@gmail.com"],
    },
    Template: "VisitorArrivalNotification",
    TemplateData: JSON.stringify({
      name: "John Doe",
      visitor_name: "Jane Smith",
    }),
  };

  try {
    await ses.send(new SendTemplatedEmailCommand(params));
    return { statusCode: 200, body: "Email sent!" };
  } catch (err) {
    return { statusCode: 500, body: err.message };
  }
};
