import type { NextApiRequest, NextApiResponse } from "next";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  GetCommand,
  PutCommand,
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";

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
    const getCommand = new GetCommand({
      TableName: "my-app",
      Key: {
        email: req.body.email,
      },
    });
    const getResponse = await docClient.send(getCommand);
    if (getResponse.$metadata.httpStatusCode === 200 && getResponse.Item) {
      res
        .status(200)
        .json({ statusCode: getResponse.$metadata.httpStatusCode });
      return;
    }
    const putCommand = new PutCommand({
      TableName: "my-app",
      Item: {
        email: req.body.email,
      },
    });
    const putResponse = await docClient.send(putCommand);
    if (putResponse.$metadata.httpStatusCode === 200) {
      res
        .status(200)
        .json({ statusCode: putResponse.$metadata.httpStatusCode });
    }
  }
}
