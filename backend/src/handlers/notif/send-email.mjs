import { SESClient, SendTemplatedEmailCommand } from "@aws-sdk/client-ses";
const ses = new SESClient();

export const sendEmailHandler = async (event) => {
  const sysNotifEmailAddress = process.env.SYS_NOTIF_EMAIL_ADDRESS;
  if (!sysNotifEmailAddress) {
    return {
      statusCode: 500,
      body: "System notification email address is not configured.",
    };
  }

  const body = JSON.parse(event.body);

  let toAddresses = body.ToAddresses;

  if (!toAddresses || !Array.isArray(toAddresses) || toAddresses.length === 0) {
    return {
      statusCode: 400,
      body: "Recipient email addresses are required.",
    };
  }

  let template = body.Template;
  let residentName = body.resident_name;
  let visitorName = body.visitor_name;

  const params = {
    Source: sysNotifEmailAddress,
    Destination: {
      ToAddresses: toAddresses,
    },
    Template: template,
    TemplateData: JSON.stringify({
      resident_name: residentName,
      visitor_name: visitorName,
    }),
  };

  try {
    await ses.send(new SendTemplatedEmailCommand(params));
    return { statusCode: 200, body: "Email sent!" };
  } catch (err) {
    return { statusCode: 500, body: err.message };
  }
};
