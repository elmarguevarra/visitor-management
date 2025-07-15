import { SESClient, SendTemplatedEmailCommand } from "@aws-sdk/client-ses";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const ses = new SESClient();
const frontEndBaseUrl = process.env.APP_FRONTEND_BASE_URL;

const s3 = new AWS.S3();

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
  let visitQrCodeDataURL = body.data.visit_qrCodeDataURL;

  const qrCodeImageUrl = await generateUploadQRCode(visitQrCodeDataURL);

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
      visit_qrCodeImageURL: qrCodeImageUrl,
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

export const generateUploadQRCode = async (visitQrCodeDataURL) => {
  const base64 = visitQrCodeDataURL.replace(/^data:image\/png;base64,/, "");
  const buffer = Buffer.from(base64, "base64");
  const key = `qrcodes/${uuidv4()}.png`;

  try {
    await s3
      .putObject({
        Bucket: "visit-qr-codes",
        Key: key,
        Body: buffer,
        ContentType: "image/png",
        ACL: "public-read",
      })
      .promise();

    return `https://visit-qr-codes.s3.amazonaws.com/${key}`;
  } catch (error) {
    console.error("Error uploading QR code to S3:", error);
    throw new Error("Failed to upload QR code image.");
  }
};
