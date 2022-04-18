import { NextApiRequest, NextApiResponse } from "next";
import { connect } from "../../../utils/connection";
import { ResponseFuncs } from "../../../utils/types";
import { CardsAPI } from "../../../utils/api";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;

  const catcher = (error: Error) => res.status(400).json({ error });

  const handleCase: ResponseFuncs = {
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Card } = await connect();
      const { topic_id } = req.body as CardsAPI["by_topic"]["post"]["params"];
      res.json(await Card.find({ topic_id }).catch(catcher));
    },
  };

  const response = handleCase[method];
  if (response) response(req, res);
  else res.status(400).json({ error: "No Response for This Request" });
};

export default handler;
