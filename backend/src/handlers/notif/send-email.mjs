import { SESClient, SendTemplatedEmailCommand } from "@aws-sdk/client-ses";
const ses = new SESClient();

export const sendEmailHandler = async (event) => {
  const params = {
    Source: "vms.info@alphinecodetech.click", //TODO: Get from SAM Template
    Destination: {
      ToAddresses: [
        "ballesterosivymae@icloud.com",
        "elmar.guevarra@icloud.com",
      ],
    },
    Template: "VisitorArrivalNotification",
    TemplateData: JSON.stringify({
      name: "Ivy Ballesteros",
      visitor_name: "Maling Swarovski",
    }),
  };

  try {
    await ses.send(new SendTemplatedEmailCommand(params));
    return { statusCode: 200, body: "Email sent!" };
  } catch (err) {
    return { statusCode: 500, body: err.message };
  }
};
