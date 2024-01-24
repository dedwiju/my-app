import type { NextApiRequest, NextApiResponse } from "next";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

type ResponseData = {
  statusCode: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const client = new DynamoDBClient({});
  const docClient = DynamoDBDocumentClient.from(client);

  if (req.method === "POST") {
    const command = new PutCommand({
      TableName: "my-app",
      Item: {
        email: req.body.email,
      },
    });
    const response = await docClient.send(command);
    if (response.$metadata.httpStatusCode === 200) {
      res.status(200).json({ statusCode: response.$metadata.httpStatusCode });
    }
  }
}
