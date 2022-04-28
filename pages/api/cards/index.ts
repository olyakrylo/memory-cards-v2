import { NextApiRequest, NextApiResponse } from "next";
import { RedisKey } from "ioredis";

import { connect } from "../../../utils/connection";
import { ResponseFuncs } from "../../../utils/types";
import { CardsAPI } from "../../../utils/api";
import RedisClient from "../../../utils/redis";

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
      const body = req.body as CardsAPI[""]["put"]["params"];
      const { _id: id } = req.body as CardsAPI[""]["put"]["params"];
      const { Card } = await connect();

      const exCard = await Card.findById(id);
      const delKeys = [] as RedisKey[];
      if (
        exCard.question.image &&
        exCard.question.image !== body.question.image
      ) {
        delKeys.push(exCard.question.image);
      }
      if (exCard.answer.image && exCard.answer.image !== body.answer.image) {
        delKeys.push(exCard.answer.image);
      }
      if (delKeys.length) {
        await RedisClient.deleteByKeys(delKeys);
      }

      res.json(await Card.findByIdAndUpdate(id, req.body, { new: true }));
    },
    DELETE: async (req: NextApiRequest, res: NextApiResponse) => {
      const { id } = req.body as CardsAPI[""]["delete"]["params"];
      const { Card } = await connect();

      const card = await Card.findById(id);
      const delKeys = [] as RedisKey[];
      if (card.question.image) {
        delKeys.push(card.question.image);
      }
      if (card.answer.image) {
        delKeys.push(card.answer.image);
      }
      if (delKeys.length) {
        await RedisClient.deleteByKeys(delKeys);
      }

      res.json(await Card.findByIdAndDelete(id, { new: true }));
    },
  };

  const response = handleCase[method];
  if (response) response(req, res);
  else res.status(400).json({ error: "No Response for This Request" });
};

export default handler;
