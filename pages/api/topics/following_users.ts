import { NextApiRequest, NextApiResponse } from "next";

import { connect } from "../../../utils/connection";
import { ResponseFuncs, TopicsAPI } from "../../../shared/api";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;

  const handleCase: ResponseFuncs = {
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      const { id } = req.query as TopicsAPI["following_users"]["get"]["query"];

      const { Topic, User } = await connect();

      const topic = await Topic.findById(id);
      const users = await Promise.all(
        topic._doc.users_id.map((userId: string) => {
          return User.findById(userId);
        })
      );
      res.json(users);
    },
  };

  const response = handleCase[method];
  if (response) response(req, res);
  else res.status(400).json({ error: "No Response for This Request" });
};

export default handler;
