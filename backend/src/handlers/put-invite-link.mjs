import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
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
const tableName = process.env.INVITE_LINKS_TABLE;
const frontEndBaseUrl = process.env.APP_FRONTEND_BASE_URL;

/**
 * A simple example includes a HTTP post method to add one item to a DynamoDB table.
 */
export const putInviteLinkItemHandler = async (event) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
    }
    console.info('received:', event);

    const body = JSON.parse(event.body);
    let residentId = body.residentId;
    let inviteLinkExpiration = body.inviteLinkExpiration;
    let adjustedTTL;

    if(inviteLinkExpiration){
        const inviteLinkExpirationTimeInHours = 24;
        adjustedTTL = calculateTTLInSeconds(inviteLinkExpiration, inviteLinkExpirationTimeInHours);
    }

    const inviteData = await generateInviteData();

    const params = {
        TableName: tableName,
        Item: {
            inviteToken: inviteData.token,
            residentId: residentId,
            inviteLink: inviteData.inviteLink,
            inviteLinkExpiration: rawTTL ? adjustedTTL.toISOString() : inviteData.inviteLinkExpiration,
            ttl: inviteLinkExpiration ? adjustedTTL : inviteData.ttl
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
        inviteToken: inviteData.token,
        residentId: residentId,
        inviteLink: inviteData.inviteLink,
        inviteLinkExpiration: inviteData.inviteLinkExpiration
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



/**
 * Generates an invite link.
 */
export const generateInviteData = async () => {
    const token = uuidv4();
    const inviteLink = `${frontEndBaseUrl}/self-register-visitor/${token}`;
    const expirationDate = new Date();
    const inviteLinkExpirationTimeInHours = 24;
    const ttlInSeconds = calculateTTLInSeconds(expirationDate, inviteLinkExpirationTimeInHours)

    const responseBody = {
        token: token,
        inviteLink: inviteLink,
        inviteLinkExpiration: expirationDate.toISOString(),
        ttl: ttlInSeconds
    };
    return responseBody;
};
