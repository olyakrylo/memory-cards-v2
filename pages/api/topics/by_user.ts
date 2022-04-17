import { NextApiRequest, NextApiResponse } from "next";
import Cookies from "cookies";

import { connect } from "../../../utils/connection";
import { ResponseFuncs } from "../../../utils/types";
import { TopicsAPI } from "../../../utils/api";
import { getCookie } from "../../../utils/cookies";
import { config } from "../../../utils/config";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;
  const { secret } = config;
  const cookies = new Cookies(req, res);

  const catcher = (error: Error) => res.status(400).json({ error });

  const handleCase: ResponseFuncs = {
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Topic } = await connect();
      const userId = getCookie(cookies, "id_token", secret);
      res.json(await Topic.find({ users_id: userId }).catch(catcher));
    },
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
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
