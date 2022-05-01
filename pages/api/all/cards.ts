import { NextApiRequest, NextApiResponse } from "next";
import { connect } from "../../../utils/connection";
import { ResponseFuncs } from "../../../utils/types";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;

  const handleCase: ResponseFuncs = {
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      const skip = parseInt(req.query.skip as string, 10) || 0;
      const limit = parseInt(req.query.limit as string, 10) || 0;

      const { Card, Topic } = await connect();

      const [cards, count] = await Promise.all([
        Card.find({}).sort({ topic_id: -1 }).skip(skip).limit(limit),
        Card.count({}),
      ]);

      const topicIdSet = new Set(cards.map((c) => c._doc.topic_id));

      const topics = await Topic.find({ id: { $in: Array.from(topicIdSet) } });
      const topicsMap = topics.reduce(
        (res, curr) => ({
          ...res,
          [curr._doc._id.toString()]: curr._doc.title,
        }),
        {}
      );

      res.json({
        count,
        data: cards.map((card) => ({
          ...card._doc,
          topic_title: topicsMap[card._doc.topic_id],
        })),
      });
    },
  };

  const response = handleCase[method];
  if (response) response(req, res);
  else res.status(400).json({ error: "No Response for This Request" });
};

export default handler;
