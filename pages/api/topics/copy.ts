import { NextApiRequest, NextApiResponse } from "next";
import { connect } from "../../../utils/connection";
import { ResponseFuncs } from "../../../shared/api";
import { TopicsAPI } from "../../../shared/api";
import { getUserId } from "../../../utils/get-user-id";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;

  const handleCase: ResponseFuncs = {
    PUT: async (req: NextApiRequest, res: NextApiResponse) => {
      const { id } = req.query as TopicsAPI["copy"]["put"]["query"];
      const { title } = req.body as TopicsAPI["copy"]["put"]["body"];

      const userId = getUserId(req, res);
      if (!userId) {
        res.json({});
        return;
      }

      const { Topic, Card } = await connect();

      const [copiedTopic, newTopic, copiedCards] = await Promise.all([
        Topic.findById(id),
        Topic.create({
          title: title,
          users_id: [userId],
          author_id: userId,
        }),
        Card.find({ topic_id: id }),
      ]);

      await Promise.all([
        Card.insertMany(
          copiedCards.map((card) => ({
            topic_id: newTopic._id,
            question: card._doc.question,
            answer: card._doc.answer,
          }))
        ),
        Topic.findByIdAndUpdate(copiedTopic._id, {
          users_id: copiedTopic._doc.users_id.filter(
            (uid: string) => uid !== userId
          ),
        }),
      ]);

      const updatedTopics = await Topic.find({ users_id: userId });

      res.json({ topics: updatedTopics });
    },
  };

  const response = handleCase[method];
  if (response) response(req, res);
  else res.status(400).json({ error: "No Response for This Request" });
};

export default handler;
