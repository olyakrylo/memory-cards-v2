import { NextApiRequest, NextApiResponse } from "next";

import { ResponseFuncs } from "../../../shared/api";
import RedisClient from "../../../utils/redis";
import { checkAccessToData } from "../../../utils/check-access-to-data";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;

  const handleCase: ResponseFuncs = {
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      const hasAccess = await checkAccessToData(req, res);
      if (!hasAccess) {
        res.json({ error: "Access denied" });
        return;
      }

      const skip = parseInt(req.query.skip as string, 10) || 0;
      const limit = parseInt(req.query.limit as string, 10) || 0;

      const keys = await RedisClient.getKeys();

      res.json({ data: keys.slice(skip, skip + limit), count: keys.length });
    },
  };

  const response = handleCase[method];
  if (response) response(req, res);
  else res.status(400).json({ error: "No Response for This Request" });
};

export default handler;
