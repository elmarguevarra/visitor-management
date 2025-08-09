import { SESClient, SendTemplatedEmailCommand } from "@aws-sdk/client-ses";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

const ses = new SESClient();
const s3Client = new S3Client();

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
  console.debug("Received body:", body);

  let toAddresses = body.data.toAddresses;

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
  let residentEmail = body.data.resident_email;
  let visitorEmail = body.data.visitor_email;
  let residentGivenName = body.data.resident_givenName;
  let residentFamilyName = body.data.resident_familyName;
  let visitorName = body.data.visitor_name;
  let arrivalTime = body.data.arrival_time;
  let departureTime = body.data.departure_time;
  let visitDate = body.data.visit_date;
  let visitQrCodeDataURL = body.data.visit_qrCodeDataURL;

  let qrCodeImageUrl = null;
  if (visitQrCodeDataURL) {
    qrCodeImageUrl = await generateUploadQRCode(visitQrCodeDataURL, visitDate);
  }

  const params = {
    Source: sysNotifEmailAddress,
    Destination: {
      ToAddresses: toAddresses,
      BccAddresses: ["admin@alphinecodetech.click"], //TODO: Fetch this from environment variables
    },
    Template: template,
    TemplateData: JSON.stringify({
      resident_givenName: residentGivenName,
      resident_fullName: `${residentGivenName} ${residentFamilyName}`,
      resident_email: residentEmail,
      visitor_name: visitorName,
      visitor_email: visitorEmail,
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

export const generateUploadQRCode = async (visitQrCodeDataURL, visitDate) => {
  const base64 = visitQrCodeDataURL.replace(/^data:image\/png;base64,/, "");
  const buffer = Buffer.from(base64, "base64");
  const key = `qrcodes/${uuidv4()}.png`; //TODO: Fetch this from environment variables

  try {
    const expirationDate = new Date(visitDate);
    expirationDate.setUTCDate(expirationDate.getUTCDate() + 1);

    const command = new PutObjectCommand({
      Bucket: "visit-qr-codes", //TODO: Fetch this from environment variables
      Key: key,
      Body: buffer,
      ContentType: "image/png",
      Expires: expirationDate,
    });

    await s3Client.send(command);

    console.debug("QR Code uploaded successfully:", key);

    const getCommand = new GetObjectCommand({
      Bucket: "visit-qr-codes", //TODO: Fetch this from environment variables
      Key: key,
    });

    const getUrl = await getSignedUrl(s3Client, getCommand, {
      expiresIn: 604800, // 7 days in seconds
    });

    return getUrl;
  } catch (error) {
    console.error("Error uploading QR code to S3:", error);
    throw new Error("Failed to upload QR code image.");
  }
};
