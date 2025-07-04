// Import getUserItemsHandler function from get-all-items.mjs
import { getUserItemsHandler } from "../../../src/handlers/get-all-items.mjs";
// Import dynamodb from aws-sdk
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";

// This includes all tests for getUserItemsHandler()
describe("Test getUserItemsHandler", () => {
  const ddbMock = mockClient(DynamoDBDocumentClient);

  beforeEach(() => {
    ddbMock.reset();
  });

  it("should return ids", async () => {
    const items = [{ id: "id1" }, { id: "id2" }];

    // Return the specified value whenever the spied scan function is called
    ddbMock.on(ScanCommand).resolves({
      Items: items,
    });

    const event = {
      httpMethod: "GET",
    };

    // Invoke helloFromLambdaHandler()
    const result = await getUserItemsHandler(event);

    const expectedResult = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": frontEndBaseUrl,
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
      body: JSON.stringify(items),
    };

    // Compare the result with the expected result
    expect(result).toEqual(expectedResult);
  });
});
