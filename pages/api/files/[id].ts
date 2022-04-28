import { NextApiRequest, NextApiResponse } from "next";

import { RedisRequest, ResponseFuncs } from "../../../utils/types";
import RedisClient from "../../../utils/redis";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;

  const handleCase: ResponseFuncs = {
    GET: async (req: RedisRequest, res: NextApiResponse) => {
      const { id: filename } = req.query as { id: string };

      const image = await RedisClient.getImage(filename);
      res.end(image);
    },
  };

  const response = handleCase[method];
  if (response) response(req, res);
  else res.status(400).json({ error: "No Response for This Request" });
};

export default handler;
