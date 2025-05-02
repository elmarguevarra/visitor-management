import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { calculateTTLInSeconds } from './utils.mjs';

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

    let residentId = body.residentId;
    let inviteToken = body.inviteToken;
    let registrationId = body.registrationId;
    let visitorName = body.visitorName;
    let visitDate = body.visitDate;
    let requestStatus = body.requestStatus;

    const expirationDate = new Date(visitDate);
    expirationDate.setHours(0, 0, 0, 0);
    const inviteLinkExpirationTimeInHours = 24;
    const ttlInSeconds = calculateTTLInSeconds(expirationDate, inviteLinkExpirationTimeInHours);

    const params = {
        TableName: tableName,
        Item: {
            residentId: residentId,
            inviteToken: inviteToken,
            registrationId: registrationId,
            visitorName: visitorName,
            visitDate: new Date(visitDate).toISOString(),
            requestStatus: requestStatus,
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
        residentId: params.Item.residentId,
        inviteToken: params.Item.inviteToken,
        registrationId: params.Item.registrationId,
        visitorName: params.Item.visitorName,
        visitDate: params.Item.visitDate,
        requestStatus: params.Item.requestStatus,
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

