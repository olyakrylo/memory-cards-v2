import { NextApiRequest, NextApiResponse } from "next";
import { connect } from "../../../utils/connection";
import { ResponseFuncs } from "../../../utils/types";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;

  const catcher = (error: Error) => res.status(400).json({ error });

  const { id } = req.query;

  const handleCase: ResponseFuncs = {
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Card } = await connect();
      res.json(await Card.findById(id).catch(catcher));
    },
    PUT: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Card } = await connect();
      res.json(await Card.findByIdAndUpdate(id, req.body, { new: true }));
    },
    DELETE: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Card } = await connect();
      res.json(await Card.findByIdAndDelete(id, { new: true }));
    },
  };

  const response = handleCase[method];
  if (response) response(req, res);
  else res.status(400).json({ error: "No Response for This Request" });
};

export default handler;
