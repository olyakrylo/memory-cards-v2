import { NextApiRequest, NextApiResponse } from "next";

import { connect } from "../../../utils/connection";
import { ResponseFuncs } from "../../../utils/types";
import { TopicsAPI } from "../../../utils/api";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;

  const handleCase: ResponseFuncs = {
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      const { id } = req.query as TopicsAPI["by_author"]["get"]["query"];

      const { Topic } = await connect();
      res.json({ topics: await Topic.find({ author_id: id }) });
    },
  };

  const response = handleCase[method];
  if (response) response(req, res);
  else res.status(400).json({ error: "No Response for This Request" });
};

export default handler;
