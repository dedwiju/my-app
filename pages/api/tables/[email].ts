import type { NextApiRequest, NextApiResponse } from "next";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = new DynamoDBClient({});
  const docClient = DynamoDBDocumentClient.from(client);

  if (req.method === "GET") {
    const command = new GetCommand({
      TableName: "my-app",
      Key: {
        email: req.query.email,
      },
    });
    const response = await docClient.send(command);
    if (response.$metadata.httpStatusCode === 200) {
      res.status(200).json({
        statusCode: response.$metadata.httpStatusCode,
        items: response.Item,
      });
    }
  }
}
