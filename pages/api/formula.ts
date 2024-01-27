import type { NextApiRequest, NextApiResponse } from "next";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UpdateCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

type ResponseData = {
  statusCode: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const client = new DynamoDBClient({});
  const docClient = DynamoDBDocumentClient.from(client);

  if (req.method === "PUT") {
    const command = new UpdateCommand({
      TableName: "my-app",
      Key: {
        email: req.body.email,
      },
      UpdateExpression: "set formula = :formula",
      ExpressionAttributeValues: {
        ":formula": req.body.formula,
      },
    });
    const response = await docClient.send(command);
    if (response.$metadata.httpStatusCode === 200) {
      res.status(200).json({ statusCode: response.$metadata.httpStatusCode });
    }
  }
}
