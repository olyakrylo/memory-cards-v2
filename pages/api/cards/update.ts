import { NextApiRequest, NextApiResponse } from "next";
import { connect } from "../../../utils/connection";
import { ResponseFuncs } from "../../../utils/types";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;

  const catcher = (error: Error) => res.status(400).json({ error });

  const handleCase: ResponseFuncs = {
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Card } = await connect();
      console.log(Card);
      const cards = await Card.find({});

      await Promise.all(
        cards.map(async (card) => {
          const newCard = await Card.updateOne(
            { _id: card._id },
            {
              question: {
                text: card.question,
              },
              answer: {
                text: card.answer,
              },
            },
            { new: true }
          );
        })
      );
      res.json({ success: true });
    },
  };

  const response = handleCase[method];
  if (response) response(req, res);
  else res.status(400).json({ error: "No Response for This Request" });
};

export default handler;
