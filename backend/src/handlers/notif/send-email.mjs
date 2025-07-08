import { SESClient, SendTemplatedEmailCommand } from "@aws-sdk/client-ses";
const ses = new SESClient();

const frontEndBaseUrl = process.env.APP_FRONTEND_BASE_URL;

export const sendEmailHandler = async (event) => {
  const sysNotifEmailAddress = process.env.SYS_NOTIF_EMAIL_ADDRESS;
  if (!sysNotifEmailAddress) {
    return {
      statusCode: 500,
      body: "System notification email address is not configured.",
    };
  }

  const body = JSON.parse(event.body);
  console.log("Received body:", body);

  let residentEmail = body.data.resident_email;
  let visitorEmail = body.data.visitor_email;

  let toAddresses = [residentEmail];
  if (visitorEmail) {
    toAddresses = [visitorEmail];
  }

  if (!toAddresses || !Array.isArray(toAddresses) || toAddresses.length === 0) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": frontEndBaseUrl,
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT",
      },
      body: "Recipient email addresses are required.",
    };
  }

  let template = body.template;
  let residentGivenName = body.data.resident_givenName;
  let residentFamilyName = body.data.resident_familyName;
  let visitorName = body.data.visitor_name;
  let arrivalTime = body.data.arrival_time;
  let departureTime = body.data.departure_time;
  let visitDate = body.data.visit_date;

  const params = {
    Source: sysNotifEmailAddress,
    Destination: {
      ToAddresses: toAddresses,
    },
    Template: template,
    TemplateData: JSON.stringify({
      resident_givenName: residentGivenName,
      resident_fullName: `${residentGivenName} ${residentFamilyName}`,
      resident_email: residentEmail,
      visitor_name: visitorName,
      arrival_time: arrivalTime,
      departure_time: departureTime,
      visit_date: visitDate,
    }),
  };

  try {
    const result = await ses.send(new SendTemplatedEmailCommand(params));
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": frontEndBaseUrl,
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT",
      },
      body: JSON.stringify(result),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": frontEndBaseUrl,
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT",
      },
      body: err.message,
    };
  }
};
