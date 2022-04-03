import { NextApiRequest, NextApiResponse } from "next";
import { connect } from "../../../utils/connection";
import { ResponseFuncs } from "../../../utils/types";
import { dataExample } from "../../../data.example";
import { TopicsAPI } from "../../../utils/api";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;
  const { NO_CONNECTION } = process.env;

  const catcher = (error: Error) => res.status(400).json({ error });

  const handleCase: ResponseFuncs = {
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
      if (NO_CONNECTION) {
        res.json(dataExample.topics);
        return;
      }

      const { Topic } = await connect();
      const { user_id } = req.body as TopicsAPI["by_user"]["post"]["params"];
      res.json(await Topic.find({ users_id: user_id }).catch(catcher));
    },
  };

  const response = handleCase[method];
  if (response) response(req, res);
  else res.status(400).json({ error: "No Response for This Request" });
};

export default handler;
