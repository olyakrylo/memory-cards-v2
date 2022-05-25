import { NextApiRequest, NextApiResponse } from "next";

import { ResponseFuncs } from "../../../shared/api";
import { checkAccessToData } from "../../../utils/check-access-to-data";
import { connect } from "../../../utils/connection";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;

  const hasAccess = await checkAccessToData(req, res);
  if (!hasAccess) {
    res.status(403).json({ error: "Access denied" });
    return;
  }

  const handleCase: ResponseFuncs = {
    DELETE: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Card, Topic } = await connect();

      const topics = new Set<string>();
      const removingIds: string[] = [];

      const allCards = await Card.find();
      allCards.forEach((card) => topics.add(card.topic_id));

      await Promise.all(
        Array.from(topics).map(async (topicId) => {
          const topic = await Topic.findById(topicId);
          if (!topic) {
            removingIds.push(topicId);
          }
        })
      );

      await Card.deleteMany({ topic_id: { $in: removingIds } });

      res.json({ updated: true });
    },
  };

  const response = handleCase[method];
  if (response) response(req, res);
  else res.status(400).json({ error: "No Response for This Request" });
};

export default handler;
