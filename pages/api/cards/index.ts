import { NextApiRequest, NextApiResponse } from "next";
import { RedisKey } from "ioredis";

import { connect } from "../../../utils/connection";
import { ResponseFuncs } from "../../../shared/api";
import { CardsAPI } from "../../../shared/api";
import RedisClient from "../../../utils/redis";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;

  const catcher = (error: Error) => res.status(400).json({ error });

  const handleCase: ResponseFuncs = {
    // create
    PUT: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Card } = await connect();
      const { cards } = req.body as CardsAPI[""]["put"]["body"];
      res.json(await Card.create(cards, { checkKeys: true }).catch(catcher));
    },
    // update
    PATCH: async (req: NextApiRequest, res: NextApiResponse) => {
      const { _id, question, answer } =
        req.body as CardsAPI[""]["patch"]["body"];

      const { Card } = await connect();

      const exCard = await Card.findById(_id);
      const delKeys = [] as RedisKey[];
      if (exCard.question.image && exCard.question.image !== question.image) {
        delKeys.push(exCard.question.image);
      }
      if (exCard.answer.image && exCard.answer.image !== answer.image) {
        delKeys.push(exCard.answer.image);
      }
      if (delKeys.length) {
        await RedisClient.deleteByKeys(delKeys);
      }

      const newCard = await Card.findByIdAndUpdate(_id, req.body, {
        new: true,
      });
      res.json(newCard);
    },
    // delete
    DELETE: async (req: NextApiRequest, res: NextApiResponse) => {
      const { ids } = req.query as { ids: string };
      const parsedIds = ids.split(",");

      const { Card } = await connect();

      const filter = { _id: { $in: parsedIds } };
      const cards = await Card.find(filter);

      const delKeys = [] as RedisKey[];
      cards.forEach((card) => {
        if (card.question.image) {
          delKeys.push(card.question.image);
        }
        if (card.answer.image) {
          delKeys.push(card.answer.image);
        }
      });

      if (delKeys.length) {
        await RedisClient.deleteByKeys(delKeys);
      }

      const { deletedCount } = await Card.deleteMany(filter);

      res.json({ updated: deletedCount === parsedIds.length });
    },
  };

  const response = handleCase[method];
  if (response) response(req, res);
  else res.status(400).json({ error: "No Response for This Request" });
};

export default handler;
