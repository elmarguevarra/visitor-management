import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

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
const tableName = process.env.VISIT_REQUESTS_TABLE;
const frontEndBaseUrl = process.env.APP_FRONTEND_BASE_URL;


/**
 * A simple example includes a HTTP post method to add one item to a DynamoDB table.
 */
export const putVisitRequestHandler = async (event) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
    }
    // All log statements are written to CloudWatch
    console.info('received:', event);

    // Get id and name from the body of the request
    const body = JSON.parse(event.body);

    const registrationId = Math.random().toString(36).substring(2, 15);
    let inviteToken = body.inviteToken;
    let visitorName = body.visitorName;
    let visitDate = body.visitDate;

    const expirationDate = new Date(visitDate);
    expirationDate.setDate(visitDate.getDate() + 1);
    // Calculate the TTL (epoch time in seconds)
    const ttlInSeconds = Math.floor(expirationDate.getTime() / 1000);

    const params = {
        TableName: tableName,
        Item: {
            registrationId: registrationId,
            inviteToken: inviteToken,
            visitorName: visitorName,
            visitDate: visitDate,
            requestStatus: "PENDING",
            ttl: ttlInSeconds
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
        inviteToken: inviteToken,
        visitorName: visitorName,
        visitDate: visitDate,
        requestStatus: VisitRequestStatus.PENDING,
        ttl: ttlInSeconds
    };

    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*", //DO NOT USE THIS VALUE IN PRODUCTION
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT"
        },
        body: JSON.stringify(responseBody)
    };

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
};

