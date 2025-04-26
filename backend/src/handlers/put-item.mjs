// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import QRCode from 'qrcode';

//DynamoDB Endpoint
const ENDPOINT_OVERRIDE = process.env.ENDPOINT_OVERRIDE;
let ddbClient = undefined;

if (ENDPOINT_OVERRIDE) {
  ddbClient = new DynamoDBClient({ endpoint: ENDPOINT_OVERRIDE });    
}
else {
  ddbClient = new DynamoDBClient({});    // Use default values for DynamoDB endpoint
  console.warn("No value for ENDPOINT_OVERRIDE provided for DynamoDB, using default");
}

const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

// Get the DynamoDB table name from environment variables
const tableName = process.env.VISITORS_TABLE;

const frontEndBaseUrl = process.env.APP_FRONTEND_BASE_URL
/**
 * A simple example includes a HTTP post method to add one item to a DynamoDB table.
 */
export const putItemHandler = async (event) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
    }
    // All log statements are written to CloudWatch
    console.info('received:', event);

    // Get id and name from the body of the request
    const body = JSON.parse(event.body);

    let registrationId = body.registrationId
    let registrationTime =  body.registrationTime
    const visitorName = body.visitorName;
    const visitDate = body.visitDate;
    const residentId = body.residentId;
    const arrivalTime = body.arrivalTime
    const departureTime = body.departureTime
    const hasArrived = body.hasArrived
    const hasDeparted = body.hasDeparted

    if(!registrationId){
      registrationId = Math.random().toString(36).substring(2, 15); 
      registrationTime =  new Date().toISOString();
    }

    const qrCodeData = `${frontEndBaseUrl}/verify-visitor/${registrationId}`;
    console.log("process.env.APP_FRONTEND_BASE_URL", frontEndBaseUrl)

    let qrCodeDataURL = null;
    try {
        qrCodeDataURL = await QRCode.toDataURL(qrCodeData);
        console.log('QR Code Data URL generated:', qrCodeDataURL);
    } catch (error) {
        console.error('Error generating QR code:', error);
        // Decide how to handle QR code generation failure.
        // You might want to still save the visitor data without the QR code or return an error.
        // For this example, we'll log the error and continue without the QR code URL.
    }

    // Creates a new item, or replaces an old item with a new item
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property
    var params = {
        TableName : tableName,
        Item: {
          registrationId: registrationId,
          residentId: residentId,
          visitorName: visitorName,
          visitDate: visitDate,
          registrationTime: registrationTime,
          qrCodeDataURL: qrCodeDataURL,
          arrivalTime: arrivalTime,
          departureTime: departureTime, 
          hasArrived: hasArrived,
          hasDeparted: hasDeparted
      },
    };

    try {
        const data = await ddbDocClient.send(new PutCommand(params));
        console.log("Success - item added or updated", data);
      } catch (err) {
        console.error("Error adding or updating item:", err.message);
        console.error("Error code:", err.code);
        console.error("Error name:", err.name);
        console.error("Error stack:", err.stack);

        throw err;
      }

      const responseBody = {
        registrationId: registrationId,
        residentId: residentId,
        visitorName: visitorName,
        visitDate: visitDate,
        registrationTime: registrationTime,
        qrCodeDataURL: qrCodeDataURL,
        arrivalTime: arrivalTime,
        departureTime: departureTime,
        hasArrived: hasArrived,
        hasDeparted: hasDeparted
    };

    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*", //DO NOT USE THIS VALUE IN PRODUCTION - https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-cors.html
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT"
        },
        body: JSON.stringify(responseBody)
    };

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
};
