import { NextApiRequest, NextApiResponse } from "next";

import { connect } from "../../../utils/connection";
import { ResponseFuncs } from "../../../shared/api";
import { getUserId } from "../../../utils/get-user-id";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;

  const handleCase: ResponseFuncs = {
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Topic } = await connect();
      const userId = getUserId(req, res);

      const [selfCount, publicCount] = await Promise.all([
        await Topic.count({
          users_id: userId,
          author_id: userId,
        }),
        await Topic.count({
          users_id: userId,
          author_id: { $ne: userId },
        }),
      ]);
      res.json({ self: selfCount, public: publicCount });
    },
  };

  const response = handleCase[method];
  if (response) response(req, res);
  else res.status(400).json({ error: "No Response for This Request" });
};

export default handler;
