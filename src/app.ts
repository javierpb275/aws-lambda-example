import express, { Request, Response } from "express";
import { hello } from "./index";

const app = express();
const PORT = 3000;

app.use(express.json());

app.post("/:someid", async (req: Request, res: Response) => {
  const { someid } = req.params;
  const queryParameters = req.query;
  const event = {
    body: JSON.stringify(req.body),
    headers: { Authorization: req.header("Authorization") },
    pathParameters: { someid },
    queryStringParameters: queryParameters,
  };

  const result = await hello(event as any);
  res.status(result.statusCode).json(JSON.parse(result.body));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
