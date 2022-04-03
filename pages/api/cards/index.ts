import { NextApiRequest, NextApiResponse } from "next";
import { connect } from "../../../utils/connection";
import { ResponseFuncs } from "../../../utils/types";
import { CardsAPI } from "../../../utils/api";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;

  const catcher = (error: Error) => res.status(400).json({ error });

  const handleCase: ResponseFuncs = {
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Card } = await connect();
      res.json(await Card.find({}).catch(catcher));
    },
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Card } = await connect();
      const { cards } = req.body as CardsAPI[""]["post"]["params"];
      res.json(await Card.create(cards, { checkKeys: true }).catch(catcher));
    },
    PUT: async (req: NextApiRequest, res: NextApiResponse) => {
      const { _id: id } = req.body as CardsAPI[""]["put"]["params"];
      const { Card } = await connect();
      res.json(await Card.findByIdAndUpdate(id, req.body, { new: true }));
    },
    DELETE: async (req: NextApiRequest, res: NextApiResponse) => {
      const { id } = req.body as CardsAPI[""]["delete"]["params"];
      const { Card } = await connect();
      res.json(await Card.findByIdAndDelete(id, { new: true }));
    },
  };

  const response = handleCase[method];
  if (response) response(req, res);
  else res.status(400).json({ error: "No Response for This Request" });
};

export default handler;
